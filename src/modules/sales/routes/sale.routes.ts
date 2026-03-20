import { Router } from "express"
import { SaleController } from "../controllers/SaleController"
import { authMiddleware } from "../../../middlewares/authMiddleware"

const saleRoutes = Router()

const controller = new SaleController()

saleRoutes.post(
  "/sales",
  authMiddleware,
  (req, res) => controller.create(req, res)
)

saleRoutes.get(
  "/sales",
  authMiddleware,
  (req, res) => controller.list(req, res)
)

export { saleRoutes }