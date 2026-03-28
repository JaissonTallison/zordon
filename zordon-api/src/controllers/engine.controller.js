import { executarMotor } from "../engine/engine.js";
import {
  listarResultados,
  limparResultados
} from "../repositories/result.repository.js";

export async function executarAnalise(req, res) {
  try {
    const empresaId = req.usuario.empresa_id;

    const resultados = executarMotor(req.body, empresaId);

    return res.json(resultados);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
}

export async function obterResultados(req, res) {
  try {
    const empresaId = req.usuario.empresa_id;

    const resultados = await listarResultados(empresaId);

    return res.json(resultados);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
}

export async function limpar(req, res) {
  try {
    const empresaId = req.usuario.empresa_id;

    await limparResultados(empresaId);

    return res.json({ sucesso: true });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
}