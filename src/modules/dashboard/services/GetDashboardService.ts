import { pool } from "../../../database/db"

export class DashboardService {

  async execute() {

    const products = await pool.query(`SELECT COUNT(*) FROM products`)
    const sales = await pool.query(`SELECT COUNT(*) FROM sales`)
    const revenue = await pool.query(`SELECT SUM(total_value) FROM sales`)

    return {
      totalProducts: products.rows[0].count,
      totalSales: sales.rows[0].count,
      totalRevenue: revenue.rows[0].sum
    }
  }
}