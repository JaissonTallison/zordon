import { Router } from "express"
import { AuthController } from "../controllers/AuthController"

const authRoutes = Router()

const controller = new AuthController()

authRoutes.post("/auth/register", (req, res) => controller.register(req, res))
authRoutes.post("/auth/login", (req, res) => controller.login(req, res))

export { authRoutes }