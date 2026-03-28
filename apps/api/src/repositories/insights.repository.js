import { pool } from "../config/database.js";

export async function getProdutos() {
  const result = await pool.query("SELECT * FROM produtos");
  return result.rows;
}

export async function getVendas() {
  const result = await pool.query("SELECT * FROM vendas");
  return result.rows;
}