import { saleRepository } from "../../sales/repositories/SaleRepository"
import { productRepository } from "../../products/repositories/ProductRepository"

export class AnalyzeSalesService {

  execute() {

    const sales = saleRepository.list()
    const products = productRepository.list()

    const insights = products.map(product => {

      const productSales = sales.filter(
        sale => sale.productId === product.id
      )

      const totalSold = productSales.reduce(
        (sum, sale) => sum + sale.quantity,
        0
      )

      let insight = "Venda dentro do padrão."

      if (totalSold === 0) {
        insight = "Produto sem vendas. Considere promoção ou desconto."
      } 
      else if (totalSold < 3) {
        insight = "Produto com baixa saída."
      } 
      else if (totalSold >= 5) {
        insight = "Produto com alta demanda. Considere aumentar o estoque."
      }

      if (product.stock < product.minStock) {
        insight += " ⚠ Estoque abaixo do mínimo."
      }

      return {
        productId: product.id,
        product: product.name,
        totalSold,
        stock: product.stock,
        insight
      }

    })

    return insights
  }

}
