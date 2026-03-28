import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET;

export async function hashSenha(senha) {
  return await bcrypt.hash(senha, 10);
}

export async function compararSenha(senha, hash) {
  return await bcrypt.compare(senha, hash);
}

export function gerarToken(usuario) {
  return jwt.sign(
    {
      id: usuario.id,
      role: usuario.role,
      empresa_id: usuario.empresa_id
    },
    SECRET,
    { expiresIn: "1d" }
  );
}