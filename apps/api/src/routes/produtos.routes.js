import express from "express";
import multer from "multer";

import {
  getProdutos,
  createProdutoController,
  updateProdutoController,
  deleteProdutoController
} from "../controllers/produto.controller.js";
import { importarRelatorioController } from "../controllers/importacao.controller.js";

import { autenticar } from "../middlewares/auth.middleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

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
 * IMPORTAR RELATÓRIO (.xlsx, .xls, .csv, .txt) — cria/atualiza produtos e vendas
 */
router.post("/importar", upload.single("arquivo"), importarRelatorioController);

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