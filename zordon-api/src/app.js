import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import engineRoutes from "./routes/engine.routes.js";
import inviteRoutes from "./routes/invite.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// rotas
app.use("/api/auth", authRoutes);
app.use("/api/engine", engineRoutes);
app.use("/api/invite", inviteRoutes);

// health check
app.get("/", (req, res) => {
  res.send("ZORDON API rodando...");
});

export default app;