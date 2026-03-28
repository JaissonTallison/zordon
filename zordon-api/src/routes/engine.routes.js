import express from "express";
import {
  executarAnalise,
  obterResultados,
  limpar
} from "../controllers/engine.controller.js";

import { autenticar } from "../middlewares/auth.middleware.js";
import { autorizar } from "../middlewares/role.middleware.js";

const router = express.Router();

// ANALISTA e ADMIN podem executar
router.post(
  "/executar",
  autenticar,
  autorizar("ADMIN", "ANALISTA"),
  executarAnalise
);

// todos autenticados podem ver
router.get(
  "/resultados",
  autenticar,
  autorizar("ADMIN", "ANALISTA", "VISUALIZADOR"),
  obterResultados
);

// só ADMIN pode apagar
router.delete(
  "/resultados",
  autenticar,
  autorizar("ADMIN"),
  limpar
);

export default router;