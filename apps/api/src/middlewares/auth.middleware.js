import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET;

/**
 * Autenticação (JWT)
 */
export function autenticar(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Token não fornecido"
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      return res.status(401).json({
        error: "Formato do token inválido"
      });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({
        error: "Formato deve ser Bearer TOKEN"
      });
    }

    const decoded = jwt.verify(token, SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      empresa_id: decoded.empresa_id
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      error: "Token inválido ou expirado"
    });
  }
}

/**
 * Autorização por role
 */
export function autorizar(roleNecessaria) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: "Usuário não autenticado"
        });
      }

      if (req.user.role !== roleNecessaria) {
        return res.status(403).json({
          error: "Acesso negado"
        });
      }

      return next();
    } catch (error) {
      return res.status(500).json({
        error: "Erro na autorização"
      });
    }
  };
}