import { Router } from "express";
import {
  sendFeedback,
  getDecisions,
} from "../controllers/decision.controller.js";

const router = Router();

// listar decisões
router.get("/", getDecisions);

// enviar feedback
router.post("/:id/feedback", sendFeedback);

export default router;