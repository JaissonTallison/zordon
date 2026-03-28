import app from "./app.js";
import { conectarDB } from "./config/database.js";

const PORT = 3000;

async function start() {
  await conectarDB();

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

start();