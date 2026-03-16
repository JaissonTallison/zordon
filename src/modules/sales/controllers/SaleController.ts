import { Request, Response } from "express"
import { ListSalesService } from "../services/ListSalesService"

export class SaleController {

  async list(req: Request, res: Response) {

    const service = new ListSalesService()

    const sales = await service.execute()

    return res.json(sales)

  }

}