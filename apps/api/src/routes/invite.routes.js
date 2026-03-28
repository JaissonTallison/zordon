import express from "express";
import { convidar } from "../controllers/invite.controller.js";
import { autenticar } from "../middlewares/auth.middleware.js";
import { autorizar } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/convidar",
  autenticar,
  autorizar("ADMIN"),
  convidar
);

export default router;