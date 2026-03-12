import { Sale } from "../entities/Sale"
import { saleRepository } from "../repositories/SaleRepository"

interface CreateSaleRequest {
  productId: string
  quantity: number
  unitPrice: number
}

export class CreateSaleService {

  execute({ productId, quantity, unitPrice }: CreateSaleRequest): Sale {

    const totalValue = quantity * unitPrice

    const sale: Sale = {
      id: String(Date.now()),
      productId,
      quantity,
      unitPrice,
      totalValue,
      createdAt: new Date()
    }

    return saleRepository.create(sale)
  }

}
