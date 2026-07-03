import axios from "axios";
import { buscarEmpresa } from "../repositories/empresa.repository.js";

const WEBHOOK_URL_PADRAO = process.env.WEBHOOK_URL || null;

/**
 * Envia alerta para webhook externo.
 * Usa a URL configurada na empresa (RF-40); se a empresa não tiver
 * uma URL própria, cai no WEBHOOK_URL global do .env (se existir).
 */
export async function enviarNotificacao(alerta, empresaId) {
  let webhookUrl = WEBHOOK_URL_PADRAO;

  if (empresaId) {
    try {
      const empresa = await buscarEmpresa(empresaId);
      if (empresa?.webhook_url) {
        webhookUrl = empresa.webhook_url;
      }
    } catch (error) {
      console.error("Erro ao buscar webhook da empresa:", error.message);
    }
  }

  if (!webhookUrl) {
    console.log("Webhook não configurado");
    return;
  }

  try {
    await axios.post(webhookUrl, {
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