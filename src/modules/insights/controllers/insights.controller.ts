import { Request, Response } from "express"
import { AnalyzeSalesService } from "../services/AnalyzeSalesService"

export class InsightsController {

  async handle(req: Request, res: Response) {

    const service = new AnalyzeSalesService()

    const result = await service.execute()

    return res.json(result)

  }

}