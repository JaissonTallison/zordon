import engine from "../engine/engine.js";
import strategyEngine from "../engine/strategy/strategyEngine.js";
import alertEngine from "../engine/alerts/alertEngine.js";

import { analisarTendencias } from "../engine/analytics/trendAnalyzer.js";
import { preverProblemas } from "../engine/analytics/predictor.js";
import { simularCenarios } from "../engine/analytics/scenarioSimulator.js";

import { findAllProdutos } from "../repositories/produto.repository.js";
import vendaRepository from "../repositories/venda.repository.js";

import {
  salvarResultados,
  contarRecorrencia,
  listarResultados,
  limparResultados
} from "../repositories/result.repository.js";

import metricsRepository from "../repositories/metrics.repository.js";

import { calcularEscalonamento } from "../engine/utils/escalationCalculator.js";
import { normalizarDecisao } from "../engine/utils/normalizer.js";

/**
 * PESO DAS REGRAS
 */
const RULE_WEIGHTS = {
  PRODUTO_PARADO: 1.2,
  ESTOQUE_BAIXO: 1.5,
  PRODUTO_ALTA_DEMANDA: 1.1
};

/**
 * CORE ZORDON
 */
async function run({ empresaId }) {
  if (!empresaId) {
    throw new Error("empresaId é obrigatório");
  }

  try {
    /**
     * 1. DADOS
     */
    const produtos = await findAllProdutos(empresaId);
    const vendas = await vendaRepository.getAll(empresaId);

    /**
     * 2. ENGINE BASE
     */
    let decisions = await engine({ produtos, vendas });

    // 🔥 NORMALIZA RETORNO (engine pode vir agrupado)
    if (!Array.isArray(decisions)) {
      decisions = [
        ...(decisions?.problemas || []),
        ...(decisions?.alertas || []),
        ...(decisions?.oportunidades || []),
        ...(decisions?.previsoes || [])
      ];
    }

    if (!Array.isArray(decisions)) decisions = [];

    /**
     * 3. NORMALIZAÇÃO (CRÍTICO)
     */
    decisions = decisions.map(normalizarDecisao);

    /**
     * 🔥 GARANTE NÚMEROS (EVITA BUG DO "0")
     */
    decisions = decisions.map((d) => ({
      ...d,
      impacto_valor: Number(d.impacto_valor || 0),
      score: Number(d.score || 0)
    }));

    /**
     * 4. ENRIQUECIMENTO
     */
    decisions = await Promise.all(
      decisions.map(async (d) => {
        try {
          const recorrencia = await contarRecorrencia({
            codigo: d.codigo,
            produto_id: d.produto_id,
            empresaId
          });

          const escalonamento = calcularEscalonamento({
            ...d,
            recorrencia
          });

          const stats = await metricsRepository.getDecisionResults(d.id);

          const positivos = Number(stats?.total_positivo || 0);
          const negativos = Number(stats?.total_negativo || 0);
          const total = positivos + negativos;

          const performance = total === 0 ? 0.5 : positivos / total;

          const pesoBase = RULE_WEIGHTS[d.codigo] || 1;
          const pesoFinal = pesoBase * (0.5 + performance);

          const score_final = (d.score || 0) * pesoFinal;

          return {
            ...d,
            recorrencia,
            mensagem_recorrencia:
              recorrencia > 1
                ? `Problema ocorre há ${recorrencia} dias consecutivos`
                : null,
            performance,
            peso_regra: pesoFinal,
            score_final,
            ...escalonamento
          };
        } catch (err) {
          console.error("Erro enriquecendo decisão:", err);
          return d; // fallback
        }
      })
    );

    /**
     * 5. STRATEGY (BLINDADO)
     */
    try {
      decisions = strategyEngine(decisions);
    } catch (err) {
      console.error("Erro strategyEngine:", err);
    }

    /**
     * 6. ALERTAS (NÃO QUEBRA)
     */
    let alerts = [];
    try {
      alerts = alertEngine(decisions);
    } catch (err) {
      console.error("Erro alertEngine:", err);
    }

    /**
     * 7. ORDENAÇÃO FINAL
     */
    decisions.sort((a, b) => (b.score_final || 0) - (a.score_final || 0));

    /**
     * 8. HISTÓRICO + ANALYTICS (SEGURO)
     */
    let historico = [];
    try {
      historico = await listarResultados(empresaId);
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
    }

    let tendencias = [];
    let previsoes = [];
    let cenarios = [];

    try {
      tendencias = analisarTendencias(historico);
      previsoes = preverProblemas(decisions);
      cenarios = simularCenarios(decisions);
    } catch (err) {
      console.error("Erro analytics:", err);
    }

    /**
     * 9. PERSISTÊNCIA
     */
    if (decisions.length > 0) {
      try {
        await salvarResultados(decisions, empresaId);
      } catch (err) {
        console.error("Erro ao salvar resultados:", err);
      }
    }

    /**
     * 10. METADATA OCULTA
     */
    Object.defineProperty(decisions, "_meta", {
      value: {
        alerts,
        tendencias,
        previsoes,
        cenarios
      },
      enumerable: false
    });

    return decisions;

  } catch (error) {
    console.error("Erro geral do engine:", error);
    return [];
  }
}

/**
 * RESULTADOS
 */
async function getResultados({ empresaId }) {
  if (!empresaId) {
    throw new Error("empresaId é obrigatório");
  }

  return await listarResultados(empresaId);
}

/**
 * LIMPAR
 */
async function limparResultadosService({ empresaId }) {
  if (!empresaId) {
    throw new Error("empresaId é obrigatório");
  }

  await limparResultados(empresaId);
}

/**
 * CRON
 */
export async function executarEngineAutomatico(empresaId = 1) {
  try {
    const decisions = await run({ empresaId });

    const impacto = decisions.reduce(
      (acc, d) => acc + (Number(d.impacto_valor) || 0),
      0
    );

    console.log(
      `ZORDON executado | Impacto: R$ ${impacto} | Decisões: ${decisions.length}`
    );

  } catch (error) {
    console.error("Erro no cron:", error);
  }
}

export default {
  run,
  getResultados,
  limparResultados: limparResultadosService
};