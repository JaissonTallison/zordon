import { saleRepository } from "../../sales/repositories/SaleRepository"
import { productRepository } from "../../products/repositories/ProductRepository"

export class AnalyzeSalesService {

  execute() {

    const sales = saleRepository.list()
    const products = productRepository.list()

    const analysis = products.map(product => {

      const productSales = sales.filter(
        sale => sale.productId === product.id
      )

      const totalSold = productSales.reduce(
        (sum, sale) => sum + sale.quantity,
        0
      )

      return {
        productId: product.id,
        product: product.name,
        totalSold,
        stock: product.stock
      }

    })

    const topSelling = analysis.filter(item => item.totalSold >= 5)

    const lowSales = analysis.filter(
      item => item.totalSold > 0 && item.totalSold < 5
    )

    const noSales = analysis.filter(item => item.totalSold === 0)

    return {
      topSelling,
      lowSales,
      noSales
    }

  }

}
