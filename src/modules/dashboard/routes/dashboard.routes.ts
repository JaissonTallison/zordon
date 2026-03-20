import { Router } from "express"
import { DashboardController } from "../controllers/DashboardController"
import { authMiddleware } from "../../../middlewares/authMiddleware"

const dashboardRoutes = Router()

const controller = new DashboardController()

dashboardRoutes.get(
  "/dashboard",
  authMiddleware,
  (req, res) => controller.handle(req, res)
)

export { dashboardRoutes }