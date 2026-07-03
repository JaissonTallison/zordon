import express from "express";

import {
  listar,
  alterarRole,
  editarPerfil,
  remover
} from "../controllers/user.management.controller.js";

import { autenticar, autorizar } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * Autenticação obrigatória para todas rotas
 */
router.use(autenticar);

/**
 * Qualquer usuário autenticado pode editar o próprio perfil
 */
router.put("/me", editarPerfil);

/**
 * Apenas ADMIN pode acessar
 */
router.get("/", autorizar("ADMIN"), listar);

router.put("/role", autorizar("ADMIN"), alterarRole);

router.delete("/", autorizar("ADMIN"), remover);

export default router;