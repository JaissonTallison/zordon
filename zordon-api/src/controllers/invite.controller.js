import crypto from "crypto";
import { criarConvite } from "../repositories/invite.repository.js";

// ADMIN cria convite
export async function convidar(req, res) {
  try {
    const { email } = req.body;
    const empresa_id = req.usuario.empresa_id;

    const token = crypto.randomBytes(20).toString("hex");

    const convite = await criarConvite({
      email,
      empresa_id,
      token
    });

    return res.json({
      mensagem: "Convite criado",
      token
    });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}