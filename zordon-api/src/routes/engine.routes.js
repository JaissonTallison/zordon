import express from "express";
import {
  executarAnalise,
  obterResultados,
  limpar
} from "../controllers/engine.controller.js";

const router = express.Router();

router.post("/executar", executarAnalise);
router.get("/resultados", obterResultados);
router.delete("/resultados", limpar);

export default router;