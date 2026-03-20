import { pool } from "../../../database/db"

export class CreateSaleService {

  async execute({ productId, quantity, unitPrice }: any) {

    const product = await pool.query(
      `SELECT * FROM products WHERE id = $1`,
      [productId]
    )

    if (product.rows.length === 0) {
      throw new Error("Product not found")
    }

    const totalValue = quantity * unitPrice

    const sale = await pool.query(
      `
      INSERT INTO sales
      (product_id, quantity, unit_price, total_value)
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
      [productId, quantity, unitPrice, totalValue]
    )

    await pool.query(
      `
      UPDATE products
      SET stock = stock - $1
      WHERE id = $2
      `,
      [quantity, productId]
    )

    return sale.rows[0]

  }

}