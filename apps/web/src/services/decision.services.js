import api from "./api";

// buscar decisões
export const getDecisions = async () => {
  const { data } = await api.get("/decisions");
  return data;
};

// enviar feedback
export const sendFeedback = async (decisionId, payload) => {
  const { data } = await api.post(
    `/decisions/${decisionId}/feedback`,
    payload
  );
  return data;
};