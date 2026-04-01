import express from "express";

import { listar } from "../controllers/audit.controller.js";
import { autenticar, autorizar } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * Todas rotas autenticadas
 */
router.use(autenticar);

/**
 * Apenas ADMIN pode acessar auditoria
 */
router.get("/", autorizar("ADMIN"), listar);

export default router;