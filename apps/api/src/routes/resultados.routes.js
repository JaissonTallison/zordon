import express from "express";
import { listarResultados } from "../controllers/resultados.controller.js";
import { autenticar } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", autenticar, listarResultados);

export default router;