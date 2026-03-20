import { Request, Response } from "express"
import { DashboardService } from "../services/DashboardService"

export class DashboardController {

  async handle(req: Request, res: Response) {

    const service = new DashboardService()

    const result = await service.execute()

    return res.json(result)

  }

}