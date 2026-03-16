import { Request, Response } from "express"
import { CreateProductService } from "../services/CreateProductService"
import { ListProductsService } from "../services/ListProductsService"

export class ProductController {

  async create(req: Request, res: Response) {

    const service = new CreateProductService()

    const product = await service.execute(req.body)

    return res.json(product)
  }

  async list(req: Request, res: Response) {

    const service = new ListProductsService()

    const products = await service.execute()

    return res.json(products)
  }
}