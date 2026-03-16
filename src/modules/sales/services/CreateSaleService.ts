import { pool } from "../../../database/db"

export class CreateSaleService {

  async execute({ productId, quantity, unitPrice }: any) {

    const totalValue = quantity * unitPrice

    const result = await pool.query(
      `
      INSERT INTO sales (product_id, quantity, unit_price, total_value)
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
      [productId, quantity, unitPrice, totalValue]
    )

    return result.rows[0]
  }
}