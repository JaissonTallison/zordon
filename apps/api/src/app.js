import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import engineRoutes from "./routes/engine.routes.js";
import inviteRoutes from "./routes/invite.routes.js";
import userManagementRoutes from "./routes/user.management.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import produtosRoutes from "./routes/produtos.routes.js";
import decisionRoutes from "./routes/decision.routes.js";
import { autenticar } from "./middlewares/auth.middleware.js";
import resultadosRoutes from "./routes/resultados.routes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ROTAS PROTEGIDAS
app.use("/api/auth", authRoutes);
app.use("/api/engine", autenticar, engineRoutes);
app.use("/api/invite", autenticar, inviteRoutes);
app.use("/api/users", autenticar, userManagementRoutes);
app.use("/api/audit", autenticar, auditRoutes);
app.use("/api/produtos", autenticar, produtosRoutes);
app.use("/api/decisions", autenticar, decisionRoutes);
app.use("/api/resultados", autenticar, resultadosRoutes);



// health check
app.get("/", (req, res) => {
  res.send("ZORDON API rodando...");
});

export default app;