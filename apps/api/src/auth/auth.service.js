import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// carregar env (executar uma única vez)
dotenv.config();

const SECRET = process.env.JWT_SECRET;

// validação forte (evita erro silencioso)
if (!SECRET) {
  throw new Error("JWT_SECRET não está definido no .env");
}

// ============================
// HASH DE SENHA
// ============================
export async function hashSenha(senha) {
  if (!senha) {
    throw new Error("Senha não fornecida para hash");
  }

  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(senha, salt);
}

// ============================
// COMPARAR SENHA
// ============================
export async function compararSenha(senha, hash) {
  if (!senha || !hash) {
    throw new Error("Dados inválidos para comparação de senha");
  }

  return bcrypt.compare(senha, hash);
}

// ============================
// GERAR TOKEN JWT
// ============================
export function gerarToken(usuario) {
  if (!usuario || !usuario.id) {
    throw new Error("Usuário inválido para geração de token");
  }

  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email, 
      role: usuario.role,
      empresa_id: usuario.empresa_id
    },
    SECRET,
    {
      expiresIn: "1d"
    }
  );
}