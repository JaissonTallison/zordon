import { Product } from "../entities/Product"

class ProductRepository {

  private products: Product[] = []

  create(product: Product): Product {
    this.products.push(product)
    return product
  }

  list(): Product[] {
    return this.products
  }

}

export const productRepository = new ProductRepository()
