import { Router } from "express"

import { GetDashboardService } from "../services/GetDashboardService"

const dashboardRoutes = Router()

dashboardRoutes.get("/dashboard", async (req, res) => {

  const service = new GetDashboardService()

  const dashboard = await service.execute()

  return res.json(dashboard)

})

export { dashboardRoutes }
