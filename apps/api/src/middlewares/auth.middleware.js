import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET;

export function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  // padrão: Bearer TOKEN
  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({ erro: "Formato do token inválido" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ erro: "Formato deve ser Bearer TOKEN" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.usuario = decoded;
    return next();
  } catch {
    return res.status(401).json({ erro: "Token inválido" });
  }
}