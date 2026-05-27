import { createServer } from "http";
import app from "./app.js";
import dotenv from "dotenv";

import { conectarDB } from "./config/database.js";
import { inicializarSocket } from "./services/socket.service.js";

dotenv.config();

const PORT = process.env.PORT || 3333;

/**
 * Inicialização do servidor
 */
async function startServer() {
  try {
    // Conectar ao banco
    await conectarDB();

    // Criar servidor HTTP (necessário para Socket.io)
    const httpServer = createServer(app);

    // Inicializar WebSocket
    inicializarSocket(httpServer);

    // Subir servidor
    httpServer.listen(PORT, () => {
      console.log(`✓ ZORDON API em http://localhost:${PORT}`);
      console.log(`✓ WebSocket em ws://localhost:${PORT}/ws`);
    });

  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
    process.exit(1);
  }
}

startServer();
