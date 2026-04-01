import { pool } from "../config/database.js";

export async function salvarFeedback(req, res) {
  try {
    const { decision_id, util } = req.body;
    const empresaId = req.user?.empresa_id;

    await pool.query(
      `
      INSERT INTO decision_feedback 
      (decision_id, empresa_id, resultado_real)
      VALUES ($1, $2, $3)
      `,
      [
        decision_id,
        empresaId,
        util ? 1 : -1
      ]
    );

    res.json({ sucesso: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao salvar feedback" });
  }
}