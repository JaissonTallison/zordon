import { pool } from "../config/database.js";

const getDecisionResults = async (decisionId) => {
  const query = `
    SELECT 
      COUNT(*) FILTER (WHERE resultado_real > 0) AS total_positivo,
      COUNT(*) FILTER (WHERE resultado_real < 0) AS total_negativo
    FROM decision_feedback
    WHERE decision_id = $1
  `;

  const { rows } = await pool.query(query, [decisionId]);

  return rows[0];
};

export default {
  getDecisionResults,
};