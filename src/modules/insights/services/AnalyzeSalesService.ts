import { saleRepository } from "../../sales/repositories/SaleRepository"
import { productRepository } from "../../products/repositories/ProductRepository"

export class AnalyzeSalesService {

  execute() {

    const sales = saleRepository.list()
    const products = productRepository.list()

    const result = products.map(product => {

      const productSales = sales.filter(
        sale => sale.productId === product.id
      )

      const totalSold = productSales.reduce(
        (sum, sale) => sum + sale.quantity,
        0
      )

      return {
        productId: product.id,
        name: product.name,
        totalSold,
        stock: product.stock
      }

    })

    return result
  }

}
