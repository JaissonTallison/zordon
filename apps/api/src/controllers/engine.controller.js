import engine from "../engine/engine.js";

import { findAllProdutos } from "../repositories/produto.repository.js";
import vendaRepository from "../repositories/venda.repository.js";

import {
  salvarResultados,
  listarResultados,
  limparResultados,
  contarRecorrencia
} from "../repositories/result.repository.js";

import { calcularEscalonamento } from "../engine/utils/escalationCalculator.js";
import { normalizarDecisao } from "../engine/utils/normalizer.js";
/**
 * Executa análise completa
 */
export async function executarAnalise(req, res) {
  try {
    const produtos = await findAllProdutos();
    const vendas = await vendaRepository.getAll();

    let decisions = await engine({ produtos, vendas });

    decisions = decisions.map(normalizarDecisao);



    const empresaId = req.user?.empresa_id || 1;

    // adicionar recorrência + escalonamento
    decisions = await Promise.all(
      decisions.map(async (d) => {
        const recorrencia = await contarRecorrencia({
          codigo: d.codigo,
          produto_id: d.produto_id,
          empresaId
        });

        const escalonamento = calcularEscalonamento({
          ...d,
          recorrencia
        });

        return {
          ...d,
          recorrencia,
          mensagem_recorrencia:
            recorrencia > 1
              ? `Problema ocorre há ${recorrencia} dias consecutivos`
              : null,
          ...escalonamento
        };
      })
    );

    // salvar histórico
    await salvarResultados(decisions, empresaId);

    res.json(decisions);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erro ao executar análise"
    });
  }
}

/**
 * RESULTADOS ATUAIS (dashboard)
 */
export async function obterResultados(req, res) {
  try {
    const empresaId = req.user?.empresa_id || 1;

    const resultados = await listarResultados(empresaId);

    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erro ao obter resultados"
    });
  }
}

/**
 * HISTÓRICO (timeline futura)
 */
export async function obterHistorico(req, res) {
  try {
    const empresaId = req.user?.empresa_id || 1;

    const resultados = await listarResultados(empresaId);

    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erro ao obter histórico"
    });
  }
}

/**
 * Limpar histórico
 */
export async function limpar(req, res) {
  try {
    const empresaId = req.user?.empresa_id || 1;

    await limparResultados(empresaId);

    res.json({
      mensagem: "Resultados apagados com sucesso"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erro ao limpar resultados"
    });
  }
}