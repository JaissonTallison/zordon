import decisionRepository from "../repositories/decision.repository.js";
import feedbackRepository from "../repositories/feedback.repository.js";
import metricsService from "./metrics.service.js";

const getAll = async ({ empresaId }) => {
  return await decisionRepository.getAll(empresaId);
};

const sendFeedback = async ({
  decisionId,
  status,
  resultado_real,
  observacao,
  userId,
  empresaId,
}) => {
  const validStatus = ["aplicado", "ignorado", "erro"];

  if (!validStatus.includes(status)) {
    throw new Error("Status inválido");
  }

  // exigir resultado quando aplicado
  if (status === "aplicado" && resultado_real == null) {
    throw new Error("resultado_real é obrigatório quando status = aplicado");
  }

  await feedbackRepository.create({
    decisionId,
    status,
    resultado_real,
    observacao,
    userId,
    empresaId,
  });

  await decisionRepository.updateStatus(decisionId, status);

  await metricsService.calculateConfidence(decisionId);

  return {
    success: true,
    message: "Feedback registrado com confiança baseada em resultado",
  };
};
export default {
  getAll,
  sendFeedback,
};