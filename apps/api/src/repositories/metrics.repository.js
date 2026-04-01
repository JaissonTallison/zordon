import { pool } from "../config/database.js";

/**
 * Métricas de decisão (feedback real)
 */
const getDecisionResults = async (decisionId) => {
  if (!decisionId) {
    return {
      total_positivo: 0,
      total_negativo: 0,
      total: 0,
      taxa_acerto: 0
    };
  }

  const query = `
    SELECT 
      COUNT(*) FILTER (WHERE resultado_real > 0) AS total_positivo,
      COUNT(*) FILTER (WHERE resultado_real < 0) AS total_negativo,
      COUNT(*) AS total
    FROM decision_feedback
    WHERE decision_id = $1
  `;

  const { rows } = await pool.query(query, [decisionId]);

  const data = rows[0] || {};

  const positivos = Number(data.total_positivo || 0);
  const negativos = Number(data.total_negativo || 0);
  const total = Number(data.total || 0);

  const taxa_acerto = total === 0 ? 0.5 : positivos / total;

  return {
    total_positivo: positivos,
    total_negativo: negativos,
    total,
    taxa_acerto
  };
};

export default {
  getDecisionResults,
};