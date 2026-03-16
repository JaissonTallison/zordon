import { Router } from "express"
import { ProductController } from "../controllers/ProductController"

const router = Router()

const controller = new ProductController()

router.post("/products", controller.create)
router.get("/products", controller.list)

export { router as productRoutes }