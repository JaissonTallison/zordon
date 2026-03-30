import { pool } from "../config/database.js";

const create = async ({
  decisionId,
  status,
  resultado_real,
  observacao,
  userId,
  empresaId,
}) => {
  const query = `
    INSERT INTO decision_feedback
    (decision_id, status, resultado_real, observacao, user_id, empresa_id)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;

  await pool.query(query, [
    decisionId,
    status,
    resultado_real || null,
    observacao || null,
    userId || null,
    empresaId || null,
  ]);
};

export default {
  create,
};