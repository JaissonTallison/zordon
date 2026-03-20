import { Request, Response } from "express"

import { CreateProductService } from "../services/CreateProductService"
import { ListProductsService } from "../services/ListProductsService"
import { DeleteProductService } from "../services/DeleteProductService"
import { UpdateProductService } from "../services/UpdateProductService"

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

  async update(req: Request, res: Response) {

    const id = req.params.id as string

    const service = new UpdateProductService()

    const product = await service.execute({
      id,
      ...req.body
    })

    return res.json(product)

  }

  async delete(req: Request, res: Response) {

    const id = req.params.id as string

    const service = new DeleteProductService()

    await service.execute(id)

    return res.json({
      message: "Product deleted"
    })

  }

}