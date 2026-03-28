import { executarMotor } from "../engine/engine.js";
import {
  listarResultados,
  limparResultados
} from "../repositories/result.repository.js";

export async function executarAnalise(req, res) {
  try {
    const dados = req.body;

    const resultados = executarMotor(dados);

    return res.json({
      sucesso: true,
      total: resultados.length,
      resultados
    });
  } catch (error) {
    return res.status(500).json({
      erro: error.message
    });
  }
}

export async function obterResultados(req, res) {
  try {
    const resultados = await listarResultados();

    return res.json(resultados);
  } catch (error) {
    return res.status(500).json({
      erro: error.message
    });
  }
}

export async function limpar(req, res) {
  try {
    await limparResultados();

    return res.json({ sucesso: true });
  } catch (error) {
    return res.status(500).json({
      erro: error.message
    });
  }
}