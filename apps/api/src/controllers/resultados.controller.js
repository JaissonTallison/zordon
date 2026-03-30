import { pool } from "../config/database.js"; 
export async function listarResultados(req, res) {
  try {
    const empresa_id = req.usuario.empresa_id;

    const { rows } = await pool.query(
  "SELECT * FROM resultados WHERE empresa_id = $1 ORDER BY gerado_em DESC",
  [empresa_id]
);

    return res.json(rows);
  } catch (err) {
    console.error("Erro ao listar resultados:", err);
    return res.status(500).json({ erro: "Erro ao buscar resultados" });
  }
}