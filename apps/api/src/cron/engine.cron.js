import cron from "node-cron";
import { executarEngineAutomatico } from "../services/engine.service.js";
import { listarEmpresasComEngineAtivo } from "../repositories/empresa.repository.js";

export function iniciarCronZordon() {
  console.log("CRON INICIADO...");

  cron.schedule("*/1 * * * *", async () => {
    console.log("Executando ZORDON (cron)...");

    try {
      const empresas = await listarEmpresasComEngineAtivo();

      for (const empresa of empresas) {
        await executarEngineAutomatico(empresa.id);
      }
    } catch (err) {
      console.error("Erro ao listar empresas para o cron:", err.message);
    }
  });
}