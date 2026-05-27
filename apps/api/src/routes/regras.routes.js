import express from "express";
import {
  listar,
  buscar,
  criar,
  atualizar,
  toggle,
  deletar,
} from "../controllers/regras.controller.js";

const router = express.Router();

router.get("/",          listar);
router.get("/:id",       buscar);
router.post("/",         criar);
router.put("/:id",       atualizar);
router.patch("/:id/toggle", toggle);
router.delete("/:id",    deletar);

export default router;
