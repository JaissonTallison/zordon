import { pool } from "../config/database.js";

/**
 *  Buscar todos os produtos da empresa
 */
export async function findAllProdutos(empresaId) {
  if (!empresaId) {
    throw new Error("empresaId é obrigatório em findAllProdutos");
  }

  const result = await pool.query(
    `
    SELECT id, nome, estoque, minimo, empresa_id, criado_em
    FROM produtos
    WHERE empresa_id = $1
    ORDER BY id DESC
    `,
    [empresaId]
  );

  return result.rows;
}

/**
 *  Buscar produto por ID (IMPORTANTE pro engine)
 */
export async function findProdutoById(id, empresaId) {
  const result = await pool.query(
    `
    SELECT id, nome, estoque, minimo, empresa_id
    FROM produtos
    WHERE id = $1
      AND empresa_id = $2
    LIMIT 1
    `,
    [id, empresaId]
  );

  return result.rows[0] || null;
}

/**
 *  Criar produto
 */
export async function createProduto(data, empresaId) {
  if (!empresaId) {
    throw new Error("empresaId é obrigatório em createProduto");
  }

  const { nome, estoque = 0, minimo = 0 } = data;

  if (!nome) {
    throw new Error("nome é obrigatório");
  }

  const result = await pool.query(
    `
    INSERT INTO produtos (nome, estoque, minimo, empresa_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, nome, estoque, minimo, empresa_id
    `,
    [nome, estoque, minimo, empresaId]
  );

  return result.rows[0];
}

/**
 *  Atualizar produto
 */
export async function updateProduto(id, data, empresaId) {
  if (!empresaId) {
    throw new Error("empresaId é obrigatório em updateProduto");
  }

  const { nome, estoque, minimo } = data;

  const result = await pool.query(
    `
    UPDATE produtos
    SET nome = COALESCE($1, nome),
        estoque = COALESCE($2, estoque),
        minimo = COALESCE($3, minimo)
    WHERE id = $4
      AND empresa_id = $5
    RETURNING id, nome, estoque, minimo, empresa_id
    `,
    [nome, estoque, minimo, id, empresaId]
  );

  if (result.rowCount === 0) {
    throw new Error("Produto não encontrado ou não pertence à empresa");
  }

  return result.rows[0];
}

/**
 *  Deletar produto
 */
export async function deleteProduto(id, empresaId) {
  if (!empresaId) {
    throw new Error("empresaId é obrigatório em deleteProduto");
  }

  const result = await pool.query(
    `
    DELETE FROM produtos
    WHERE id = $1
      AND empresa_id = $2
    RETURNING id
    `,
    [id, empresaId]
  );

  if (result.rowCount === 0) {
    throw new Error("Produto não encontrado ou não pertence à empresa");
  }

  return true;
}