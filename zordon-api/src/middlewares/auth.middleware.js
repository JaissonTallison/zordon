import jwt from "jsonwebtoken";

const SECRET = "zordon-secret";

export function autenticar(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.usuario = decoded;
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido" });
  }
}