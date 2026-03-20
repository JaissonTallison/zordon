import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const SECRET = "zordon_secret"

interface TokenPayload {
  userId: string
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      error: "Token not provided"
    })
  }

  const [, token] = authHeader.split(" ")

  try {

    const decoded = jwt.verify(token, SECRET)

    const { userId } = decoded as TokenPayload

    req.userId = userId

    return next()

  } catch {

    return res.status(401).json({
      error: "Invalid token"
    })

  }

}