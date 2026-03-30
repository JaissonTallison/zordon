import express from "express";

import {
  executarAnalise,
  obterResultados,
  limpar,
  obterHistorico
} from "../controllers/engine.controller.js";

const router = express.Router();

// 🔥 SEM AUTH TEMPORARIAMENTE

router.post("/executar", executarAnalise);

router.get("/resultados", obterResultados);

router.get("/historico", obterHistorico);

router.delete("/resultados", limpar);

export default router;