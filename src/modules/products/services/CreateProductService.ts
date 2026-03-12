import { Product } from "../entities/Product"
import { productRepository } from "../repositories/ProductRepository"

interface CreateProductRequest {
  name: string
  category: string
  price: number
  stock: number
  minStock: number
}

export class CreateProductService {

  execute({ name, category, price, stock, minStock }: CreateProductRequest): Product {

    const product: Product = {
      id: String(Date.now()),
      name,
      category,
      price,
      stock,
      minStock,
      createdAt: new Date()
    }

    return productRepository.create(product)
  }

}
