import { pool } from "../../../database/db"

export class AnalyzeSalesService {

  async execute() {

    const popular = await pool.query(`
      SELECT p.name, COUNT(s.id) as sales
      FROM products p
      LEFT JOIN sales s ON p.id = s.product_id
      GROUP BY p.name
      HAVING COUNT(s.id) >= 5
    `)

    const lowSales = await pool.query(`
      SELECT p.name, COUNT(s.id) as sales
      FROM products p
      LEFT JOIN sales s ON p.id = s.product_id
      GROUP BY p.name
      HAVING COUNT(s.id) BETWEEN 1 AND 4
    `)

    const noSales = await pool.query(`
      SELECT p.name
      FROM products p
      LEFT JOIN sales s ON p.id = s.product_id
      WHERE s.id IS NULL
    `)

    const lowStock = await pool.query(`
      SELECT name
      FROM products
      WHERE stock < min_stock
    `)

    return {
      popularProducts: popular.rows,
      lowSalesProducts: lowSales.rows,
      productsWithoutSales: noSales.rows,
      lowStockProducts: lowStock.rows
    }

  }

}