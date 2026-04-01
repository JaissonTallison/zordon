import { pool } from "../config/database.js";

/**
 *  Buscar todas as vendas da empresa
 */
async function getAll(empresaId) {
  if (!empresaId) {
    throw new Error("empresaId é obrigatório em vendaRepository.getAll");
  }

  const result = await pool.query(
    `
    SELECT 
      v.id,
      v.produto_id,
      v.quantidade,
      v.valor,
      v.data,
      v.empresa_id
    FROM vendas v
    WHERE v.empresa_id = $1
    ORDER BY v.data DESC
    `,
    [empresaId]
  );

  return result.rows;
}

/**
 *  Buscar vendas por produto (ESSENCIAL PRO ENGINE)
 */
async function getByProduto(produtoId, empresaId) {
  const result = await pool.query(
    `
    SELECT 
      quantidade,
      valor,
      data
    FROM vendas
    WHERE produto_id = $1
      AND empresa_id = $2
    ORDER BY data DESC
    `,
    [produtoId, empresaId]
  );

  return result.rows;
}

/**
 *  Criar venda
 */
async function createVenda(data, empresaId) {
  if (!empresaId) {
    throw new Error("empresaId é obrigatório em createVenda");
  }

  const { produto_id, quantidade, valor } = data;

  if (!produto_id || !quantidade || !valor) {
    throw new Error("produto_id, quantidade e valor são obrigatórios");
  }

  const result = await pool.query(
    `
    INSERT INTO vendas (produto_id, quantidade, valor, empresa_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, produto_id, quantidade, valor, data
    `,
    [produto_id, quantidade, valor, empresaId]
  );

  return result.rows[0];
}

/**
 *  Resumo de vendas por produto (BASE DO ZORDON)
 */
async function getResumoPorProduto(produtoId, empresaId) {
  const result = await pool.query(
    `
    SELECT 
      COUNT(*) as total_vendas,
      SUM(quantidade) as total_quantidade,
      SUM(valor) as total_faturamento
    FROM vendas
    WHERE produto_id = $1
      AND empresa_id = $2
    `,
    [produtoId, empresaId]
  );

  return result.rows[0];
}

export default {
  getAll,
  getByProduto,
  createVenda,
  getResumoPorProduto
};