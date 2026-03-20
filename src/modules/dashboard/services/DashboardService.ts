import { pool } from "../../../database/db"

export class DashboardService {

  async execute() {

    const totalProducts = await pool.query(
      `SELECT COUNT(*) FROM products`
    )

    const totalSales = await pool.query(
      `SELECT COUNT(*) FROM sales`
    )

    const totalRevenue = await pool.query(
      `SELECT COALESCE(SUM(total_value),0) FROM sales`
    )

    const topProduct = await pool.query(`
      SELECT p.name, COUNT(s.id) as sales
      FROM products p
      JOIN sales s ON p.id = s.product_id
      GROUP BY p.name
      ORDER BY sales DESC
      LIMIT 1
    `)

    return {
      totalProducts: totalProducts.rows[0].count,
      totalSales: totalSales.rows[0].count,
      totalRevenue: totalRevenue.rows[0].coalesce,
      topProduct: topProduct.rows.length > 0 ? topProduct.rows[0].name : null
    }

  }

}