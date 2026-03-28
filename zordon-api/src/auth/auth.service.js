import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = "zordon-secret"; // depois vamos para .env

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
      role: usuario.role
    },
    SECRET,
    { expiresIn: "1d" }
  );
}