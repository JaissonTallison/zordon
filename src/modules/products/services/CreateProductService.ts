import { pool } from "../../../database/db"

export class CreateProductService {

  async execute({ name, category, price, stock, minStock }: any) {

    const result = await pool.query(
      `
      INSERT INTO products (name, category, price, stock, min_stock)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [name, category, price, stock, minStock]
    )

    return result.rows[0]
  }
}