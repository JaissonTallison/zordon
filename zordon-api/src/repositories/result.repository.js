import { pool } from "../config/database.js";

export async function salvarResultados(resultados, userId) {
  for (const r of resultados) {
    await pool.query(
      `
      INSERT INTO resultados 
      (tipo, codigo, produto_id, titulo, descricao, impacto, prioridade, recomendacao, dados, gerado_em, user_id)
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
        userId
      ]
    );
  }
}

export async function listarResultados(userId) {
  const result = await pool.query(
    "SELECT * FROM resultados WHERE user_id = $1 ORDER BY id DESC",
    [userId]
  );

  return result.rows;
}

export async function limparResultados(userId) {
  await pool.query(
    "DELETE FROM resultados WHERE user_id = $1",
    [userId]
  );
}