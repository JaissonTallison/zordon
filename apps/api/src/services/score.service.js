/**
 * ZORDON — Score Operacional (0–100)
 *
 * Fórmula:
 *   Score = (Impacto × 0.40) + (Urgência × 0.25) + (Recorrência × 0.20) + (Confiança × 0.15)
 *
 * Cada dimensão é normalizada para [0, 100].
 */

import { listarResultados } from "../repositories/result.repository.js";

// ─────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────
const PESOS = {
  impacto:     0.40,
  urgencia:    0.25,
  recorrencia: 0.20,
  confianca:   0.15,
};

const URGENCIA_MAPA = {
  CRITICA: 100,
  ALTA:    75,
  MEDIA:   50,
  BAIXA:   25,
};

// TETO de impacto para normalização (ajuste conforme negócio)
const IMPACTO_TETO = 50_000;

// ─────────────────────────────────────────────────────────
// NORMALIZAÇÃO: valor para 0–100
// ─────────────────────────────────────────────────────────
function normalizar(valor, teto, piso = 0) {
  if (teto <= piso) return 0;
  return Math.min(100, Math.max(0, ((valor - piso) / (teto - piso)) * 100));
}

// ─────────────────────────────────────────────────────────
// SCORE DE UMA DECISÃO (0-100)
// ─────────────────────────────────────────────────────────
function scoredecisao(d, maxImpacto, maxRecorrencia) {
  const dimImpacto     = normalizar(Number(d.impacto_valor || 0), maxImpacto);
  const dimUrgencia    = URGENCIA_MAPA[d.prioridade] ?? 50;
  const dimRecorrencia = normalizar(Number(d.recorrencia || 0), maxRecorrencia);
  const dimConfianca   = Number(d.performance ?? 0.7) * 100;

  const score = Math.round(
    dimImpacto     * PESOS.impacto     +
    dimUrgencia    * PESOS.urgencia    +
    dimRecorrencia * PESOS.recorrencia +
    dimConfianca   * PESOS.confianca
  );

  return {
    score: Math.min(100, score),
    breakdown: {
      impacto:     Math.round(dimImpacto),
      urgencia:    Math.round(dimUrgencia),
      recorrencia: Math.round(dimRecorrencia),
      confianca:   Math.round(dimConfianca),
    },
  };
}

// ─────────────────────────────────────────────────────────
// NÍVEL DE SAÚDE OPERACIONAL (LABEL + COR)
// ─────────────────────────────────────────────────────────
function nivelSaude(score) {
  if (score >= 80) return { nivel: "CRÍTICO",  cor: "#F87171", emoji: "🔴" };
  if (score >= 60) return { nivel: "ALTO",     cor: "#FBBF24", emoji: "🟡" };
  if (score >= 40) return { nivel: "MODERADO", cor: "#818CF8", emoji: "🟣" };
  if (score >= 20) return { nivel: "BAIXO",    cor: "#34D399", emoji: "🟢" };
  return              { nivel: "SAUDÁVEL",  cor: "#34D399", emoji: "✅" };
}

// ─────────────────────────────────────────────────────────
// CALCULAR SCORE OPERACIONAL GLOBAL DA EMPRESA
// ─────────────────────────────────────────────────────────
export async function calcularScoreOperacional(empresaId) {
  const resultados = await listarResultados(empresaId);

  if (!resultados || resultados.length === 0) {
    return {
      score_operacional: 0,
      saude: nivelSaude(0),
      total_decisoes: 0,
      impacto_total: 0,
      dimensoes: { impacto: 0, urgencia: 0, recorrencia: 0, confianca: 0 },
      top_decisoes: [],
      pesos: PESOS,
    };
  }

  // Limites para normalização
  const maxImpacto     = Math.max(...resultados.map((d) => Number(d.impacto_valor || 0)), IMPACTO_TETO);
  const maxRecorrencia = Math.max(...resultados.map((d) => Number(d.recorrencia || 0)), 1);

  // Score individual de cada decisão
  const comScore = resultados.map((d) => {
    const { score, breakdown } = scoredecisao(d, maxImpacto, maxRecorrencia);
    return { ...d, _score: score, _breakdown: breakdown };
  });

  // Score global = média ponderada (decisões críticas pesam mais)
  const pesoTotal = comScore.reduce((s, d) => {
    const peso = (URGENCIA_MAPA[d.prioridade] ?? 50) / 100;
    return s + peso;
  }, 0);

  const scoreGlobal = pesoTotal > 0
    ? Math.round(
        comScore.reduce((s, d) => {
          const peso = (URGENCIA_MAPA[d.prioridade] ?? 50) / 100;
          return s + d._score * peso;
        }, 0) / pesoTotal
      )
    : 0;

  // Médias por dimensão
  const n = comScore.length;
  const mediaDim = {
    impacto:     Math.round(comScore.reduce((s, d) => s + d._breakdown.impacto,     0) / n),
    urgencia:    Math.round(comScore.reduce((s, d) => s + d._breakdown.urgencia,    0) / n),
    recorrencia: Math.round(comScore.reduce((s, d) => s + d._breakdown.recorrencia, 0) / n),
    confianca:   Math.round(comScore.reduce((s, d) => s + d._breakdown.confianca,   0) / n),
  };

  const impactoTotal = resultados.reduce((s, d) => s + Number(d.impacto_valor || 0), 0);

  // Top 5 por score
  const top5 = [...comScore]
    .sort((a, b) => b._score - a._score)
    .slice(0, 5)
    .map((d) => ({
      id:           d.id,
      codigo:       d.codigo,
      produto_nome: d.produto_nome || d.codigo,
      prioridade:   d.prioridade,
      impacto_valor: d.impacto_valor,
      score:        d._score,
      breakdown:    d._breakdown,
    }));

  return {
    score_operacional: Math.min(100, scoreGlobal),
    saude:             nivelSaude(scoreGlobal),
    total_decisoes:    resultados.length,
    impacto_total:     impactoTotal,
    dimensoes:         mediaDim,
    top_decisoes:      top5,
    pesos:             PESOS,
    gerado_em:         new Date().toISOString(),
  };
}
