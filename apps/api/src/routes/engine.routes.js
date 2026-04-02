import express from "express";

import {
  executarAnalise,
  obterResultados,
  limpar,
  obterHistorico,
  atualizarStatusDecision,
  obterInteligencia,
  obterDecisoesEstruturadas
} from "../controllers/engine.controller.js";



const router = express.Router();



router.post("/executar", executarAnalise);
router.get("/resultados", obterResultados);
router.get("/historico", obterHistorico);
router.get("/intelligence", obterInteligencia);
router.get("/decisions", obterDecisoesEstruturadas); 
router.delete("/resultados", limpar);
router.patch("/status/:id", atualizarStatusDecision);

export default router;