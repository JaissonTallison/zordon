import { listarLogs } from "../repositories/audit.repository.js";

export async function listar(req, res) {
  try {
    const empresa_id = req.usuario.empresa_id;

    const logs = await listarLogs(empresa_id);

    return res.json(logs);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}