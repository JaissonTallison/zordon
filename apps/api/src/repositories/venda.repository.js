import { pool } from "../config/database.js";

async function getAll() {
  const result = await pool.query("SELECT * FROM vendas");
  return result.rows;
}

export default {
  getAll
};