import express from "express";

import {
  listar,
  alterarRole,
  remover
} from "../controllers/user.management.controller.js";

import { autenticar, autorizar } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * Autenticação obrigatória para todas rotas
 */
router.use(autenticar);

/**
 * Apenas ADMIN pode acessar
 */
router.get("/", autorizar("ADMIN"), listar);

router.put("/role", autorizar("ADMIN"), alterarRole);

router.delete("/", autorizar("ADMIN"), remover);

export default router;