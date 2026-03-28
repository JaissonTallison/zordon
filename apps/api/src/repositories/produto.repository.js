import { pool } from "../config/database.js";

// GET
export async function findAllProdutos() {
  const result = await pool.query(
    "SELECT * FROM produtos ORDER BY id DESC"
  );
  return result.rows;
}

// CREATE
export async function createProduto(data) {
  const { nome, estoque, minimo } = data;

  const result = await pool.query(
    "INSERT INTO produtos (nome, estoque, minimo) VALUES ($1, $2, $3) RETURNING *",
    [nome, estoque, minimo]
  );

  return result.rows[0];
}

// UPDATE
export async function updateProduto(id, data) {
  const { nome, estoque, minimo } = data;

  const result = await pool.query(
    "UPDATE produtos SET nome=$1, estoque=$2, minimo=$3 WHERE id=$4 RETURNING *",
    [nome, estoque, minimo, id]
  );

  return result.rows[0];
}

// DELETE
export async function deleteProduto(id) {
  await pool.query("DELETE FROM produtos WHERE id=$1", [id]);
}