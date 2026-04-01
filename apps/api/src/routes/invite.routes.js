import express from "express";

import { convidar } from "../controllers/invite.controller.js";
import { autenticar, autorizar } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * Todas rotas autenticadas
 */
router.use(autenticar);

/**
 * Apenas ADMIN pode convidar
 */
router.post("/convidar", autorizar("ADMIN"), convidar);

export default router;