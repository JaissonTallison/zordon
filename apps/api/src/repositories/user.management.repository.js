import { pool } from "../config/database.js";

//  listar usuários da empresa
export async function listarUsuarios(empresa_id) {
  const result = await pool.query(
    `
    SELECT id, nome, email, role, criado_em
    FROM users
    WHERE empresa_id = $1
    ORDER BY id DESC
    `,
    [empresa_id]
  );

  return result.rows;
}

//  atualizar role
export async function atualizarRole(userId, role, empresa_id) {
  const result = await pool.query(
    `
    UPDATE users
    SET role = $1
    WHERE id = $2 AND empresa_id = $3
    RETURNING id, nome, email, role
    `,
    [role, userId, empresa_id]
  );

  return result.rows[0];
}

//  remover usuário
export async function removerUsuario(userId, empresa_id) {
  await pool.query(
    `
    DELETE FROM users
    WHERE id = $1 AND empresa_id = $2
    `,
    [userId, empresa_id]
  );
}