import { productRepository } from "../repositories/ProductRepository"
import { Product } from "../entities/Product"

export class ListProductsService {

  execute(): Product[] {
    return productRepository.list()
  }

}

