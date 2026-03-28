import { pool } from "../config/database.js";

//  Buscar usuário por email
export async function buscarPorEmail(email) {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0];
}

//  Criar empresa
export async function criarEmpresa(nome) {
  const result = await pool.query(
    "INSERT INTO empresas (nome) VALUES ($1) RETURNING *",
    [nome]
  );

  return result.rows[0];
}

//  Buscar empresa por nome
export async function buscarEmpresaPorNome(nome) {
  const result = await pool.query(
    "SELECT * FROM empresas WHERE nome = $1",
    [nome]
  );

  return result.rows[0];
}

//  Criar usuário
export async function criarUsuario({
  nome,
  email,
  senha,
  role,
  empresa_id
}) {
  const result = await pool.query(
    `
    INSERT INTO users (nome, email, senha, role, empresa_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [nome, email, senha, role, empresa_id]
  );

  return result.rows[0];
}