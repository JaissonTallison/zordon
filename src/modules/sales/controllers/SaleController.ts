import { Request, Response } from "express"
import { CreateSaleService } from "../services/CreateSaleService"
import { ListSalesService } from "../services/ListSalesService"

export class SaleController {

  async create(req: Request, res: Response) {

    const service = new CreateSaleService()

    const sale = await service.execute(req.body)

    return res.json(sale)

  }

  async list(req: Request, res: Response) {

    const service = new ListSalesService()

    const sales = await service.execute()

    return res.json(sales)

  }

}