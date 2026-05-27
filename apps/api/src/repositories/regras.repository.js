import { pool } from "../config/database.js";

// ─────────────────────────────────────────────────────────
// LISTAR regras de uma empresa
// ─────────────────────────────────────────────────────────
export async function listarRegras(empresaId, { apenasAtivas = false } = {}) {
  const cond = apenasAtivas ? "AND ativa = true" : "";
  const { rows } = await pool.query(
    `SELECT * FROM regras
     WHERE empresa_id = $1 ${cond}
     ORDER BY tipo, prioridade, nome`,
    [empresaId]
  );
  return rows;
}

// ─────────────────────────────────────────────────────────
// BUSCAR regra por ID
// ─────────────────────────────────────────────────────────
export async function buscarRegra(id, empresaId) {
  const { rows } = await pool.query(
    `SELECT * FROM regras WHERE id = $1 AND empresa_id = $2`,
    [id, empresaId]
  );
  return rows[0] || null;
}

// ─────────────────────────────────────────────────────────
// CRIAR regra
// ─────────────────────────────────────────────────────────
export async function criarRegra(empresaId, payload) {
  const {
    nome, codigo, tipo, prioridade = "MEDIA", ativa = true, escopo = "produto",
    condicoes, impacto_formula, titulo_template, descricao_template,
    recomendacao_template, peso = 1.0,
  } = payload;

  const { rows } = await pool.query(
    `INSERT INTO regras
       (empresa_id, nome, codigo, tipo, prioridade, ativa, escopo,
        condicoes, impacto_formula, titulo_template, descricao_template,
        recomendacao_template, peso)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING *`,
    [
      empresaId, nome, codigo, tipo, prioridade, ativa, escopo,
      JSON.stringify(condicoes), impacto_formula, titulo_template,
      descricao_template, recomendacao_template, peso,
    ]
  );
  return rows[0];
}

// ─────────────────────────────────────────────────────────
// ATUALIZAR regra
// ─────────────────────────────────────────────────────────
export async function atualizarRegra(id, empresaId, payload) {
  const {
    nome, codigo, tipo, prioridade, ativa, escopo,
    condicoes, impacto_formula, titulo_template, descricao_template,
    recomendacao_template, peso,
  } = payload;

  const { rows } = await pool.query(
    `UPDATE regras SET
       nome                  = COALESCE($3,  nome),
       codigo                = COALESCE($4,  codigo),
       tipo                  = COALESCE($5,  tipo),
       prioridade            = COALESCE($6,  prioridade),
       ativa                 = COALESCE($7,  ativa),
       escopo                = COALESCE($8,  escopo),
       condicoes             = COALESCE($9,  condicoes),
       impacto_formula       = COALESCE($10, impacto_formula),
       titulo_template       = COALESCE($11, titulo_template),
       descricao_template    = COALESCE($12, descricao_template),
       recomendacao_template = COALESCE($13, recomendacao_template),
       peso                  = COALESCE($14, peso)
     WHERE id = $1 AND empresa_id = $2
     RETURNING *`,
    [
      id, empresaId,
      nome, codigo, tipo, prioridade, ativa, escopo,
      condicoes ? JSON.stringify(condicoes) : null,
      impacto_formula, titulo_template, descricao_template,
      recomendacao_template, peso,
    ]
  );
  return rows[0] || null;
}

// ─────────────────────────────────────────────────────────
// TOGGLE ativa/inativa
// ─────────────────────────────────────────────────────────
export async function toggleRegra(id, empresaId) {
  const { rows } = await pool.query(
    `UPDATE regras SET ativa = NOT ativa
     WHERE id = $1 AND empresa_id = $2
     RETURNING *`,
    [id, empresaId]
  );
  return rows[0] || null;
}

// ─────────────────────────────────────────────────────────
// DELETAR regra
// ─────────────────────────────────────────────────────────
export async function deletarRegra(id, empresaId) {
  const { rowCount } = await pool.query(
    `DELETE FROM regras WHERE id = $1 AND empresa_id = $2`,
    [id, empresaId]
  );
  return rowCount > 0;
}
