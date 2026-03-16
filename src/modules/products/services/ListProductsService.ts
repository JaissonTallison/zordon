import { pool } from "../../../database/db"

export class ListProductsService {

  async execute() {

    const result = await pool.query(
      `SELECT * FROM products`
    )

    return result.rows
  }
}