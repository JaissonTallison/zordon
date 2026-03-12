import { Router } from "express"
import { AnalyzeSalesService } from "./services/AnalyzeSalesService"

const insightsRoutes = Router()

insightsRoutes.get("/insights", (req, res) => {

  const analyzeSalesService = new AnalyzeSalesService()

  const analysis = analyzeSalesService.execute()

  return res.json(analysis)

})

export { insightsRoutes }
