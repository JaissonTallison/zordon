import { salvarAlerta } from "../repositories/alert.repository.js";
import { enviarNotificacao } from "./notification.service.js";

/**
 * Processa decisões e gera alertas automaticamente
 */
export async function processarAlertas(decisions, empresaId) {
  for (const d of decisions) {
    try {
      // REGRA DE ALERTA
      const deveAlertar =
        d.nivel === "CRITICO" ||
        d.recorrencia >= 3;

      if (!deveAlertar) continue;

      // SALVA ALERTA NO BANCO
      await salvarAlerta(d, empresaId);

      // ENVIA NOTIFICAÇÃO (WEBHOOK)
      await enviarNotificacao(d);

      // LOG
      console.log(
        `ALERTA: ${d.titulo} | Nivel: ${d.nivel} | Recorrencia: ${d.recorrencia}`
      );

    } catch (error) {
      console.error("Erro ao processar alerta:", error.message);
    }
  }
}