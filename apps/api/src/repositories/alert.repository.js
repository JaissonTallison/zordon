import { pool } from "../config/database.js";

/**
 * Evita alertas duplicados no mesmo dia
 */
async function alertaJaExisteHoje({ codigo, produto_id, empresaId }) {
  const result = await pool.query(
    `
    SELECT 1 FROM alertas
    WHERE codigo = $1
      AND produto_id = $2
      AND empresa_id = $3
      AND DATE(criado_em) = CURRENT_DATE
    LIMIT 1
    `,
    [codigo, produto_id, empresaId]
  );

  return result.rowCount > 0;
}

/**
 * Salvar alerta
 */
export async function salvarAlerta(decisao, empresaId) {
  const existe = await alertaJaExisteHoje({
    codigo: decisao.codigo,
    produto_id: decisao.produto_id,
    empresaId
  });

  if (existe) return;

  await pool.query(
    `
    INSERT INTO alertas
    (codigo, produto_id, titulo, descricao, nivel, recorrencia, dados, empresa_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `,
    [
      decisao.codigo,
      decisao.produto_id,
      decisao.titulo,
      decisao.descricao,
      decisao.nivel,
      decisao.recorrencia,
      JSON.stringify(decisao),
      empresaId
    ]
  );
}