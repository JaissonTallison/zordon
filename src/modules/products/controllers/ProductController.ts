import { Request, Response } from "express"
import { CreateProductService } from "../services/CreateProductService"

export class ProductController {

  create(request: Request, response: Response) {

    const { name, category, price, stock, minStock } = request.body

    const createProductService = new CreateProductService()

    const product = createProductService.execute({
      name,
      category,
      price,
      stock,
      minStock
    })

    return response.json(product)
  }

}
