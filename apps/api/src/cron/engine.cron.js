import cron from "node-cron";
import { executarEngineAutomatico } from "../services/engine.service.js";

export function iniciarCronZordon() {
  console.log("CRON INICIADO..."); 

  cron.schedule("*/1 * * * *", async () => {
    console.log("Executando ZORDON (cron)...");

    await executarEngineAutomatico(1);
  });
}