import express from "express";
import { listar } from "../controllers/audit.controller.js";
import { autenticar } from "../middlewares/auth.middleware.js";
import { autorizar } from "../middlewares/role.middleware.js";

const router = express.Router();

// só ADMIN pode ver auditoria
router.get(
  "/",
  autenticar,
  autorizar("ADMIN"),
  listar
);

export default router;