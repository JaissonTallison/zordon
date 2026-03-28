import { pool } from "../config/database.js";

export async function salvarResultados(resultados) {
  for (const r of resultados) {
    await pool.query(
      `
      INSERT INTO resultados 
      (tipo, codigo, produto_id, titulo, descricao, impacto, prioridade, recomendacao, dados, gerado_em)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
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
        r.gerado_em
      ]
    );
  }
}

export async function listarResultados() {
  const result = await pool.query("SELECT * FROM resultados ORDER BY id DESC");
  return result.rows;
}

export async function limparResultados() {
  await pool.query("DELETE FROM resultados");
}