import decisionService from "../services/decision.service.js";

export const getDecisions = async (req, res) => {
  try {
    const empresaId = req.user?.empresa_id;

    const decisions = await decisionService.getAll({
      empresaId,
    });

    return res.json(decisions);
  } catch (error) {
    console.error("Erro ao buscar decisões:", error);
    return res.status(500).json({ error: "Erro interno" });
  }
};

export const sendFeedback = async (req, res) => {
  try {
    const decisionId = req.params.id;
    const { status, resultado_real, observacao } = req.body;

    if (!status) {
      return res.status(400).json({
        error: "Status é obrigatório",
      });
    }

    const result = await decisionService.sendFeedback({
      decisionId,
      status,
      resultado_real,
      observacao,
      userId: req.user?.id,
      empresaId: req.user?.empresa_id,
    });

    return res.json(result);
  } catch (error) {
    console.error("Erro ao enviar feedback:", error);
    return res.status(500).json({ error: error.message });
  }
};