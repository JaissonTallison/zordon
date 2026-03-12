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

    const insights = products.map(product => {

      const productSales = recentSales.filter(
        sale => sale.productId === product.id
      )

      const totalSold = productSales.reduce(
        (sum, sale) => sum + sale.quantity,
        0
      )

      let recommendation = "Venda dentro do padrão."

      if (totalSold === 0) {
        recommendation = "Produto sem vendas. Considere promoção ou desconto."
      }
      else if (totalSold < 3) {
        recommendation = "Produto com baixa saída. Avalie promoção."
      }
      else if (totalSold >= 5) {
        recommendation = "Alta demanda. Considere aumentar o estoque."
      }

      if (product.stock < product.minStock) {
        recommendation += " ⚠ Estoque abaixo do mínimo."
      }

      return {
        product: product.name,
        totalSold,
        stock: product.stock,
        recommendation
      }

    })

    return {
      period: "Last 7 days",
      insights
    }

  }

}
