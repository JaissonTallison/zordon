import express from "express";

import {
  getProdutos,
  createProdutoController,
  updateProdutoController,
  deleteProdutoController
} from "../controllers/produto.controller.js";

import { autenticar } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * Todas as rotas de produtos precisam de autenticação
 * pois dependem de req.user (empresa_id)
 */
router.use(autenticar);

/**
 * LISTAR PRODUTOS
 */
router.get("/", getProdutos);

/**
 * CRIAR PRODUTO
 */
router.post("/", createProdutoController);

/**
 * ATUALIZAR PRODUTO
 */
router.put("/:id", updateProdutoController);

/**
 * DELETAR PRODUTO
 */
router.delete("/:id", deleteProdutoController);

export default router;