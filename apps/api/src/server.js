import app from "./app.js";
import dotenv from "dotenv";

import { conectarDB } from "./config/database.js";
import { iniciarCronZordon } from "./cron/engine.cron.js";

dotenv.config();

const PORT = process.env.PORT || 3333;

/**
 * Inicialização do servidor
 */
async function startServer() {
  try {
    // Conectar ao banco
    await conectarDB();

    // Subir servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);

      // Iniciar cron do ZORDON
      iniciarCronZordon();
    });

  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
    process.exit(1);
  }
}

startServer();