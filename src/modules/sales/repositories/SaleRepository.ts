import { Sale } from "../entities/Sale"

class SaleRepository {

  private sales: Sale[] = []

  create(sale: Sale): Sale {
    this.sales.push(sale)
    return sale
  }

  list(): Sale[] {
    return this.sales
  }

}

export const saleRepository = new SaleRepository()
