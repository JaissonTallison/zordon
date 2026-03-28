import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

export async function conectarDB() {
  try {
    const client = await pool.connect();
    console.log("Conectado ao PostgreSQL");
    client.release();
  } catch (err) {
    console.error("Erro ao conectar no banco:", err.message);
  }
}