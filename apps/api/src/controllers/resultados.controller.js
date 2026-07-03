import { pool } from "../config/database.js";
export async function listarResultados(req, res) {
  try {
    const empresa_id = req.user.empresa_id;
    const { status, prioridade, codigo } = req.query;

    const params = [empresa_id];
    let query = "SELECT * FROM resultados WHERE empresa_id = $1";

    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    if (prioridade) {
      params.push(prioridade);
      query += ` AND prioridade = $${params.length}`;
    }

    if (codigo) {
      params.push(codigo);
      query += ` AND codigo = $${params.length}`;
    }

    query += " ORDER BY gerado_em DESC";

    const { rows } = await pool.query(query, params);

    return res.json(rows);
  } catch (err) {
    console.error("Erro ao listar resultados:", err);
    return res.status(500).json({ erro: "Erro ao buscar resultados" });
  }
}