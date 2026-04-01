import zordonService from "../services/engine.service.js";

import {
  listarResultados,
  limparResultados,
  atualizarStatus as atualizarStatusRepository
} from "../repositories/result.repository.js";

/**
 * 🚀 EXECUTAR ENGINE
 */
export async function executarAnalise(req, res) {
  try {
    console.log("🚀 ZORDON RUN");

    const empresaId = req.user?.empresa_id;

    if (!empresaId) {
      return res.status(400).json({
        error: "empresa_id não encontrado no token"
      });
    }

    const resultado = await zordonService.run({ empresaId });

    // 🔒 proteção extra
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
 * 📊 RESULTADOS
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
 * 📜 HISTÓRICO
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
 * 🧹 LIMPAR
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
 * 🔄 ATUALIZAR STATUS
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