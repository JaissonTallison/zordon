import { Router } from "express"
import { ProductController } from "../controllers/ProductController"
import { authMiddleware } from "../../../middlewares/authMiddleware"

const router = Router()

const controller = new ProductController()

router.post("/products", authMiddleware, (req, res) => controller.create(req, res))

router.get("/products", authMiddleware, (req, res) => controller.list(req, res))

router.put("/products/:id", authMiddleware, (req, res) => controller.update(req, res))

router.delete("/products/:id", authMiddleware, (req, res) => controller.delete(req, res))

export { router as productRoutes }