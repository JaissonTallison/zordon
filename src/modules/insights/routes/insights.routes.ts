import { Router } from "express"
import { InsightsController } from "../controllers/insights.controller"

const insightsRoutes = Router()

const controller = new InsightsController()

insightsRoutes.get("/insights", (req, res) => {
  return controller.handle(req, res)
})

export { insightsRoutes }