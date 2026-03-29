import axios from "axios";

const WEBHOOK_URL = process.env.WEBHOOK_URL || null;

/**
 * Envia alerta para webhook externo
 */
export async function enviarNotificacao(alerta) {
  if (!WEBHOOK_URL) {
    console.log("Webhook não configurado");
    return;
  }

  try {
    await axios.post(WEBHOOK_URL, {
      titulo: alerta.titulo,
      descricao: alerta.descricao,
      nivel: alerta.nivel,
      recorrencia: alerta.recorrencia,
      impacto: alerta.impacto,
      data: new Date()
    });

    console.log("Notificação enviada");
  } catch (error) {
    console.error("Erro ao enviar notificação:", error.message);
  }
}