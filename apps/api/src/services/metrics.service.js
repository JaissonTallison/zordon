import metricsRepository from "../repositories/metrics.repository.js";
import decisionRepository from "../repositories/decision.repository.js";

const calculateConfidence = async (decisionId) => {
  const stats = await metricsRepository.getDecisionResults(decisionId);

  const positivos = Number(stats.total_positivo || 0);
  const negativos = Number(stats.total_negativo || 0);

  const total = positivos + negativos;

  if (total === 0) {
    return 0.5;
  }

  const confianca = positivos / total;

  await decisionRepository.updateConfidence(decisionId, confianca);

  return confianca;
};

export default {
  calculateConfidence,
};