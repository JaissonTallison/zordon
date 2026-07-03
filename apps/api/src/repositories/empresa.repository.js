import { pool } from "../config/database.js";

export async function buscarEmpresa(empresaId) {
  const result = await pool.query(
    `
    SELECT id, nome, webhook_url, engine_ativo, criado_em
    FROM empresas
    WHERE id = $1
    `,
    [empresaId]
  );

  return result.rows[0] || null;
}

export async function atualizarEmpresa(empresaId, { nome, webhook_url, engine_ativo }) {
  const result = await pool.query(
    `
    UPDATE empresas
    SET nome         = COALESCE($1, nome),
        webhook_url  = COALESCE($2, webhook_url),
        engine_ativo = COALESCE($3, engine_ativo)
    WHERE id = $4
    RETURNING id, nome, webhook_url, engine_ativo, criado_em
    `,
    [nome, webhook_url, engine_ativo, empresaId]
  );

  if (result.rowCount === 0) {
    throw new Error("Empresa não encontrada");
  }

  return result.rows[0];
}

export async function listarEmpresasComEngineAtivo() {
  const result = await pool.query(
    `SELECT id FROM empresas WHERE engine_ativo = true`
  );

  return result.rows;
}
