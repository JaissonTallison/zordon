import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import engineRoutes from "./routes/engine.routes.js";
import inviteRoutes from "./routes/invite.routes.js";
import userManagementRoutes from "./routes/user.management.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import produtosRoutes from "./routes/produtos.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// rotas
app.use("/api/auth", authRoutes);
app.use("/api/engine", engineRoutes);
app.use("/api/invite", inviteRoutes);
app.use("/api/users", userManagementRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/produtos", produtosRoutes);


// health check
app.get("/", (req, res) => {
  res.send("ZORDON API rodando...");
});

export default app;