import express from "express";
import {
  listar,
  alterarRole,
  remover
} from "../controllers/user.management.controller.js";

import { autenticar } from "../middlewares/auth.middleware.js";
import { autorizar } from "../middlewares/role.middleware.js";

const router = express.Router();

// aplica autenticação uma única vez
router.use(autenticar);

// só ADMIN pode acessar
router.get("/", autorizar("ADMIN"), listar);

router.put("/role", autorizar("ADMIN"), alterarRole);

router.delete("/", autorizar("ADMIN"), remover);

export default router;