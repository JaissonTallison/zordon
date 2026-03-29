import { pool } from "../config/database.js";

/**
 * Verifica se já existe um resultado igual no mesmo dia
 */
async function jaExisteHoje({ codigo, produto_id, empresaId }) {
  const result = await pool.query(
    `
    SELECT 1 FROM resultados
    WHERE codigo = $1
      AND produto_id = $2
      AND empresa_id = $3
      AND DATE(gerado_em) = CURRENT_DATE
    LIMIT 1
    `,
    [codigo, produto_id, empresaId]
  );

  return result.rowCount > 0;
}

/**
 * Conta recorrência (dias consecutivos)
 */
export async function contarRecorrencia({ codigo, produto_id, empresaId }) {
  const result = await pool.query(
    `
    SELECT DATE(gerado_em) as dia
    FROM resultados
    WHERE codigo = $1
      AND produto_id = $2
      AND empresa_id = $3
    ORDER BY dia DESC
    `,
    [codigo, produto_id, empresaId]
  );

  const dias = result.rows.map(r => r.dia);

  if (dias.length === 0) return 0;

  let recorrencia = 1;

  for (let i = 1; i < dias.length; i++) {
    const atual = new Date(dias[i - 1]);
    const anterior = new Date(dias[i]);

    const diff = (atual - anterior) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      recorrencia++;
    } else {
      break;
    }
  }

  return recorrencia;
}

/**
 * Salva resultados evitando duplicação diária
 */
export async function salvarResultados(resultados, empresaId) {
  for (const r of resultados) {
    const existe = await jaExisteHoje({
      codigo: r.codigo,
      produto_id: r.produto_id,
      empresaId
    });

    if (existe) continue;

    await pool.query(
      `
      INSERT INTO resultados 
      (tipo, codigo, produto_id, titulo, descricao, impacto, prioridade, recomendacao, dados, gerado_em, empresa_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),$10)
      `,
      [
        r.tipo,
        r.codigo || null,
        r.produto_id || null,
        r.titulo,
        r.descricao,
        r.impacto,
        r.prioridade,
        JSON.stringify(r.recomendacao || {}),
        JSON.stringify(r),
        empresaId
      ]
    );
  }
}

/**
 * Listar histórico
 */
export async function listarResultados(empresaId) {
  const result = await pool.query(
    `
    SELECT * FROM resultados
    WHERE empresa_id = $1
    ORDER BY gerado_em DESC
    `,
    [empresaId]
  );

  return result.rows;
}

/**
 * Limpar histórico
 */
export async function limparResultados(empresaId) {
  await pool.query(
    `
    DELETE FROM resultados
    WHERE empresa_id = $1
    `,
    [empresaId]
  );
}