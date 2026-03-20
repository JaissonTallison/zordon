import { Router } from "express"
import { InsightsController } from "../controllers/insights.controller"
import { authMiddleware } from "../../../middlewares/authMiddleware"

const insightsRoutes = Router()

const controller = new InsightsController()

insightsRoutes.get(
  "/insights",
  authMiddleware,
  (req, res) => controller.handle(req, res)
)

export { insightsRoutes }