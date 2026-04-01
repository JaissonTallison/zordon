import { pool } from "../config/database.js";

/**
 * Verifica se já existe resultado no dia
 */
async function jaExisteHoje({ codigo, produto_id, empresaId }) {
  const result = await pool.query(
    `
    SELECT 1
    FROM resultados
    WHERE codigo = $1
      AND (produto_id = $2 OR ($2 IS NULL AND produto_id IS NULL))
      AND empresa_id = $3
      AND DATE(gerado_em) = CURRENT_DATE
    LIMIT 1
    `,
    [codigo, produto_id, empresaId]
  );

  return result.rowCount > 0;
}

/**
 * Recorrência (dias consecutivos)
 */
export async function contarRecorrencia({ codigo, produto_id, empresaId }) {
  const result = await pool.query(
    `
    SELECT DATE(gerado_em) as dia
    FROM resultados
    WHERE codigo = $1
      AND (produto_id = $2 OR ($2 IS NULL AND produto_id IS NULL))
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
 * Salvar resultados (FINAL + BLINDADO)
 */
export async function salvarResultados(resultados, empresaId) {
  if (!Array.isArray(resultados) || resultados.length === 0) return;

  const existentes = await pool.query(
    `
    SELECT codigo, produto_id
    FROM resultados
    WHERE empresa_id = $1
      AND DATE(gerado_em) = CURRENT_DATE
    `,
    [empresaId]
  );

  const mapaExistentes = new Set(
    existentes.rows.map(r => `${r.codigo}_${r.produto_id ?? "null"}`)
  );

  for (const r of resultados) {
    try {
      const chave = `${r.codigo}_${r.produto_id ?? "null"}`;

      if (mapaExistentes.has(chave)) continue;

      await pool.query(
        `
        INSERT INTO resultados 
        (
          tipo,
          codigo,
          produto_id,
          titulo,
          descricao,
          impacto,
          impacto_valor,
          prioridade,
          score,
          recomendacao,
          dados,
          status,
          gerado_em,
          empresa_id
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW(),$13)
        `,
        [
          r.tipo || null,
          r.codigo || null,
          r.produto_id ?? null,
          r.titulo || null,
          r.descricao || null,
          r.impacto || null,

          Number(r.impacto_valor || 0),

          r.prioridade || "MEDIO",
          Number(r.score_final ?? r.score ?? 0),

          JSON.stringify(r.recomendacao || {}),
          JSON.stringify(r),

          "PENDENTE",
          empresaId
        ]
      );
    } catch (err) {
      console.error("Erro ao salvar resultado:", err);
    }
  }
}

/**
 * Listar histórico (AGORA COM PRODUTO NOME)
 */
export async function listarResultados(empresaId) {
  const result = await pool.query(
    `
    SELECT 
      r.id,
      r.codigo,
      r.produto_id,
      p.nome AS produto_nome,
      r.impacto_valor,
      r.prioridade,
      r.score,
      r.status,
      r.gerado_em
    FROM resultados r
    LEFT JOIN produtos p ON p.id = r.produto_id
    WHERE r.empresa_id = $1
    ORDER BY r.impacto_valor DESC
    `,
    [empresaId]
  );

  return result.rows.map(r => ({
    ...r,
    impacto_valor: Number(r.impacto_valor || 0),
    score: Number(r.score || 0)
  }));
}

/**
 * Atualizar status
 */
export async function atualizarStatus(id, status, empresaId) {
  await pool.query(
    `
    UPDATE resultados
    SET status = $1
    WHERE id = $2
      AND empresa_id = $3
    `,
    [status, id, empresaId]
  );
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