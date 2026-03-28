import { executarMotor } from "../engine/engine.js";
import {
  listarResultados,
  limparResultados
} from "../repositories/result.repository.js";

export async function executarAnalise(req, res) {
  try {
    const userId = req.usuario.id;

    const resultados = executarMotor(req.body, userId);

    return res.json(resultados);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
}

export async function obterResultados(req, res) {
  try {
    const userId = req.usuario.id;

    const resultados = await listarResultados(userId);

    return res.json(resultados);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
}

export async function limpar(req, res) {
  try {
    const userId = req.usuario.id;

    await limparResultados(userId);

    return res.json({ sucesso: true });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
}