import express from "express";

import {
  executarAnalise,
  obterResultados,
  limpar,
  obterHistorico,
  atualizarStatusDecision
} from "../controllers/engine.controller.js";

import { autenticar } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(autenticar);

router.post("/executar", executarAnalise);
router.get("/resultados", obterResultados);
router.get("/historico", obterHistorico);
router.delete("/resultados", limpar);
router.patch("/status/:id", atualizarStatusDecision);

export default router;