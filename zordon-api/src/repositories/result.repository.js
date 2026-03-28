import { pool } from "../config/database.js";

export async function salvarResultados(resultados, empresaId) {
  for (const r of resultados) {
    await pool.query(
      `
      INSERT INTO resultados 
      (tipo, codigo, produto_id, titulo, descricao, impacto, prioridade, recomendacao, dados, gerado_em, empresa_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      `,
      [
        r.tipo,
        r.codigo,
        r.produto_id,
        r.titulo,
        r.descricao,
        r.impacto,
        r.prioridade,
        JSON.stringify(r.recomendacao),
        JSON.stringify(r.dados),
        r.gerado_em,
        empresaId
      ]
    );
  }
}

export async function listarResultados(empresaId) {
  const result = await pool.query(
    "SELECT * FROM resultados WHERE empresa_id = $1 ORDER BY id DESC",
    [empresaId]
  );

  return result.rows;
}

export async function limparResultados(empresaId) {
  await pool.query(
    "DELETE FROM resultados WHERE empresa_id = $1",
    [empresaId]
  );
}