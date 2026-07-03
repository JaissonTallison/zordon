import express from "express";

import { obterEmpresa, configurarEmpresa } from "../controllers/empresa.controller.js";
import { autenticar, autorizar } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(autenticar);

/**
 * Todos os usuários da empresa podem visualizar as configurações
 */
router.get("/", obterEmpresa);

/**
 * Apenas ADMIN pode alterar configurações (nome, webhook, engine ativo)
 */
router.put("/", autorizar("ADMIN"), configurarEmpresa);

export default router;
