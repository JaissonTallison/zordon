import express from "express";
import {
  listar,
  alterarRole,
  remover
} from "../controllers/user.management.controller.js";

import { autenticar } from "../middlewares/auth.middleware.js";
import { autorizar } from "../middlewares/role.middleware.js";

const router = express.Router();

// só ADMIN pode acessar
router.get(
  "/",
  autenticar,
  autorizar("ADMIN"),
  listar
);

router.put(
  "/role",
  autenticar,
  autorizar("ADMIN"),
  alterarRole
);

router.delete(
  "/",
  autenticar,
  autorizar("ADMIN"),
  remover
);

export default router;