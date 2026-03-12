import { saleRepository } from "../../sales/repositories/SaleRepository"
import { productRepository } from "../../products/repositories/ProductRepository"

export class AnalyzeSalesService {

  execute() {

    const sales = saleRepository.list()
    const products = productRepository.list()

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentSales = sales.filter(
      sale => sale.createdAt >= sevenDaysAgo
    )

    const analysis = products.map(product => {

      const productSales = recentSales.filter(
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
        stock: product.stock,
        minStock: product.minStock
      }

    })

    const topSelling = analysis.filter(item => item.totalSold >= 5)

    const lowSales = analysis.filter(
      item => item.totalSold > 0 && item.totalSold < 5
    )

    const noSales = analysis.filter(item => item.totalSold === 0)

    const lowStock = analysis.filter(
      item => item.stock < item.minStock
    )

    return {
      period: "Last 7 days",
      topSelling,
      lowSales,
      noSales,
      lowStock
    }

  }

}
