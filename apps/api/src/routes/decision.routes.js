import express from "express";
import { salvarFeedback } from "../controllers/decision.controller.js";
import { autenticar } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(autenticar);

//FEEDBACK IA
router.post("/feedback", salvarFeedback);

export default router;