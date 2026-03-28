import {
  findAllProdutos,
  createProduto,
  updateProduto,
  deleteProduto
} from "../repositories/produto.repository.js";

// GET
export async function getProdutos(req, res) {
  try {
    const produtos = await findAllProdutos();
    res.json(produtos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
}

// CREATE
export async function createProdutoController(req, res) {
  try {
    const produto = await createProduto(req.body);
    res.json(produto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
}

// UPDATE
export async function updateProdutoController(req, res) {
  try {
    const produto = await updateProduto(req.params.id, req.body);
    res.json(produto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
}

// DELETE
export async function deleteProdutoController(req, res) {
  try {
    await deleteProduto(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar produto" });
  }
}