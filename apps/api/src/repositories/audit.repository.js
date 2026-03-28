import { pool } from "../config/database.js";

export async function registrarLog({
  user_id,
  empresa_id,
  acao,
  descricao
}) {
  await pool.query(
    `
    INSERT INTO audit_logs (user_id, empresa_id, acao, descricao)
    VALUES ($1, $2, $3, $4)
    `,
    [user_id, empresa_id, acao, descricao]
  );
}

export async function listarLogs(empresa_id) {
  const result = await pool.query(
    `
    SELECT * FROM audit_logs
    WHERE empresa_id = $1
    ORDER BY id DESC
    `,
    [empresa_id]
  );

  return result.rows;
}