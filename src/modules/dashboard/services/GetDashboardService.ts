import { productRepository } from "../../products/repositories/ProductRepository"
import { saleRepository } from "../../sales/repositories/SaleRepository"

export class GetDashboardService {

  execute() {

    const products = productRepository.list()
    const sales = saleRepository.list()

    const totalProducts = products.length

    const totalSales = sales.length

    const totalRevenue = sales.reduce(
      (sum, sale) => sum + sale.totalValue,
      0
    )

    const productSalesMap: Record<string, number> = {}

    sales.forEach(sale => {
      productSalesMap[sale.productId] =
        (productSalesMap[sale.productId] || 0) + sale.quantity
    })

    let topProduct = null
    let maxSales = 0

    for (const product of products) {

      const sold = productSalesMap[product.id] || 0

      if (sold > maxSales) {
        maxSales = sold
        topProduct = product.name
      }

    }

    return {
      totalProducts,
      totalSales,
      totalRevenue,
      topProduct
    }

  }

}
