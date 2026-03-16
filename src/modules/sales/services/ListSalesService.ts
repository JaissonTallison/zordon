import { pool } from "../../../database/db"

export class ListSalesService {

  async execute() {

    const result = await pool.query(`
      SELECT 
        s.id,
        s.product_id,
        p.name AS product_name,
        s.quantity,
        s.unit_price,
        s.total_value,
        s.created_at
      FROM sales s
      JOIN products p ON p.id = s.product_id
      ORDER BY s.created_at DESC
    `)

    return result.rows

  }

}