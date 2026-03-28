import express from "express";

import {
  getProdutos,
  createProdutoController,
  updateProdutoController,
  deleteProdutoController
} from "../controllers/produto.controller.js";

const router = express.Router();

router.get("/", getProdutos);
router.post("/", createProdutoController);
router.put("/:id", updateProdutoController);
router.delete("/:id", deleteProdutoController);

export default router;