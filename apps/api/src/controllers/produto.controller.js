import {
  findAllProdutos,
  createProduto,
  updateProduto,
  deleteProduto
} from "../repositories/produto.repository.js";

/**
 * LISTAR PRODUTOS
 */
export async function getProdutos(req, res) {
  try {
    const empresaId = req.user?.empresa_id;

    if (!empresaId) {
      return res.status(400).json({
        error: "empresa_id não encontrado no token"
      });
    }

    const produtos = await findAllProdutos(empresaId);

    return res.json(produtos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Erro ao buscar produtos"
    });
  }
}

/**
 * CRIAR PRODUTO
 */
export async function createProdutoController(req, res) {
  try {
    const empresaId = req.user?.empresa_id;

    if (!empresaId) {
      return res.status(400).json({
        error: "empresa_id não encontrado no token"
      });
    }

    const produto = await createProduto(req.body, empresaId);

    return res.json(produto);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Erro ao criar produto"
    });
  }
}

/**
 * ATUALIZAR PRODUTO
 */
export async function updateProdutoController(req, res) {
  try {
    const empresaId = req.user?.empresa_id;

    if (!empresaId) {
      return res.status(400).json({
        error: "empresa_id não encontrado no token"
      });
    }

    const produto = await updateProduto(
      req.params.id,
      req.body,
      empresaId
    );

    return res.json(produto);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Erro ao atualizar produto"
    });
  }
}

/**
 * DELETAR PRODUTO
 */
export async function deleteProdutoController(req, res) {
  try {
    const empresaId = req.user?.empresa_id;

    if (!empresaId) {
      return res.status(400).json({
        error: "empresa_id não encontrado no token"
      });
    }

    await deleteProduto(req.params.id, empresaId);

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Erro ao deletar produto"
    });
  }
}