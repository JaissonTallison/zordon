import express from "express";
import {
  executarAnalise,
  obterResultados,
  limpar
} from "../controllers/engine.controller.js";

import { autenticar } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/executar", autenticar, executarAnalise);
router.get("/resultados", autenticar, obterResultados);
router.delete("/resultados", autenticar, limpar);

export default router;