import { pool } from "../config/database.js";

export async function criarUsuario({ nome, email, senha, role }) {
  const result = await pool.query(
    `INSERT INTO users (nome, email, senha, role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [nome, email, senha, role]
  );

  return result.rows[0];
}

export async function buscarPorEmail(email) {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0];
}