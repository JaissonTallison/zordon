import { pool } from "../config/database.js";

const getAll = async (empresaId) => {
  const query = `
    SELECT *
    FROM resultados
    WHERE empresa_id = $1
    ORDER BY gerado_em DESC
  `;

  const { rows } = await pool.query(query, [empresaId]);
  return rows;
};

const updateStatus = async (id, status) => {
  const query = `
    UPDATE resultados
    SET status_execucao = $1
    WHERE id = $2
  `;

  await pool.query(query, [status, id]);
};

const updateConfidence = async (id, confianca) => {
  const query = `
    UPDATE resultados
    SET confianca = $1
    WHERE id = $2
  `;

  await pool.query(query, [confianca, id]);
};

export default {
  getAll,
  updateStatus,
  updateConfidence,
};