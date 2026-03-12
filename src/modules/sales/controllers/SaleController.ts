import { Request, Response } from "express"
import { CreateSaleService } from "../services/CreateSaleService"

export class SaleController {

  create(request: Request, response: Response) {

    const { productId, quantity, unitPrice } = request.body

    const createSaleService = new CreateSaleService()

    const sale = createSaleService.execute({
      productId,
      quantity,
      unitPrice
    })

    return response.json(sale)
  }

}
