import { pool } from "../config/database.js";

export async function criarConvite({ email, empresa_id, token }) {
  const result = await pool.query(
    `
    INSERT INTO invites (email, empresa_id, token)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [email, empresa_id, token]
  );

  return result.rows[0];
}

export async function buscarConvite(token) {
  const result = await pool.query(
    "SELECT * FROM invites WHERE token = $1 AND usado = false",
    [token]
  );

  return result.rows[0];
}

export async function marcarComoUsado(id) {
  await pool.query(
    "UPDATE invites SET usado = true WHERE id = $1",
    [id]
  );
}