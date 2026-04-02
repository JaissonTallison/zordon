import zordonService from "../services/engine.service.js";
import { montarInteligencia } from "../services/intelligence.service.js";

import {
  listarResultados,
  limparResultados,
  atualizarStatus as atualizarStatusRepository
} from "../repositories/result.repository.js";

/**
 * EXECUTAR ENGINE
 */
export async function executarAnalise(req, res) {
  try {
    const empresaId = req.user?.empresa_id;

    if (!empresaId) {
      return res.status(400).json({
        error: "empresa_id não encontrado no token"
      });
    }

    const resultado = await zordonService.run({ empresaId });

    if (!Array.isArray(resultado)) {
      console.error("Resultado inválido:", resultado);
      return res.json([]);
    }

    return res.json(resultado);

  } catch (error) {
    console.error("Erro na execução:", error);

    return res.status(500).json({
      error: "Erro ao executar análise"
    });
  }
}

/**
 * RESULTADOS (ANTIGO - NÃO MEXER)
 */
export async function obterResultados(req, res) {
  try {
    const empresaId = req.user?.empresa_id;

    if (!empresaId) {
      return res.status(400).json({
        error: "empresa_id não encontrado"
      });
    }

    const resultados = await listarResultados(empresaId);

    return res.json(resultados);

  } catch (error) {
    console.error("Erro ao obter resultados:", error);

    return res.status(500).json({
      error: "Erro ao obter resultados"
    });
  }
}

/**
 * 🔥 NOVO: DECISÕES ESTRUTURADAS
 */
export async function obterDecisoesEstruturadas(req, res) {
  try {
    const empresaId = req.user?.empresa_id;

    if (!empresaId) {
      return res.status(400).json({
        error: "empresa_id não encontrado"
      });
    }

    const dados = await listarResultados(empresaId);

    const problemas = dados.filter(d =>
      d.codigo === "PRODUTO_PARADO" ||
      d.codigo === "PRODUTO_SEM_VENDAS"
    );

    const oportunidades = dados.filter(d =>
      d.codigo === "PRODUTO_ALTA_DEMANDA"
    );

    const alertas = dados.filter(d =>
      d.codigo === "ESTOQUE_BAIXO"
    );

    const impacto_total = dados.reduce(
      (acc, d) => acc + Number(d.impacto_valor || 0),
      0
    );

    return res.json({
      resumo: {
        impacto_total,
        total: dados.length,
        problemas: problemas.length,
        oportunidades: oportunidades.length,
        alertas: alertas.length
      },
      decisoes: {
        problemas,
        oportunidades,
        alertas
      }
    });

  } catch (error) {
    console.error("Erro ao estruturar decisões:", error);

    return res.status(500).json({
      error: "Erro ao estruturar decisões"
    });
  }
}

/**
 * HISTÓRICO
 */
export async function obterHistorico(req, res) {
  try {
    const empresaId = req.user?.empresa_id;

    if (!empresaId) {
      return res.status(400).json({
        error: "empresa_id não encontrado"
      });
    }

    const resultados = await listarResultados(empresaId);

    return res.json(resultados);

  } catch (error) {
    console.error("Erro ao obter histórico:", error);

    return res.status(500).json({
      error: "Erro ao obter histórico"
    });
  }
}

/**
 * LIMPAR
 */
export async function limpar(req, res) {
  try {
    const empresaId = req.user?.empresa_id;

    if (!empresaId) {
      return res.status(400).json({
        error: "empresa_id não encontrado"
      });
    }

    await limparResultados(empresaId);

    return res.json({
      mensagem: "Resultados apagados com sucesso"
    });

  } catch (error) {
    console.error("Erro ao limpar resultados:", error);

    return res.status(500).json({
      error: "Erro ao limpar resultados"
    });
  }
}

/**
 * ATUALIZAR STATUS
 */
export async function atualizarStatusDecision(req, res) {
  try {
    const empresaId = req.user?.empresa_id;
    const { id } = req.params;
    const { status } = req.body;

    if (!empresaId) {
      return res.status(400).json({
        error: "empresa_id não encontrado"
      });
    }

    if (!id) {
      return res.status(400).json({
        error: "ID é obrigatório"
      });
    }

    if (!status) {
      return res.status(400).json({
        error: "Status é obrigatório"
      });
    }

    await atualizarStatusRepository(id, status, empresaId);

    return res.json({
      sucesso: true
    });

  } catch (error) {
    console.error("Erro ao atualizar status:", error);

    return res.status(500).json({
      error: "Erro ao atualizar status"
    });
  }
}

/**
 * INTELIGÊNCIA
 */
export async function obterInteligencia(req, res) {
  try {
    const empresaId = req.user?.empresa_id;

    if (!empresaId) {
      return res.status(400).json({
        error: "empresa_id não encontrado no token"
      });
    }

    const decisions = await zordonService.run({ empresaId });
    const historico = await listarResultados(empresaId);

    const inteligencia = montarInteligencia({
      decisions,
      historico
    });

    res.json(inteligencia);

  } catch (error) {
    console.error("Erro intelligence:", error);

    res.status(500).json({
      error: "Erro ao gerar inteligência"
    });
  }
}