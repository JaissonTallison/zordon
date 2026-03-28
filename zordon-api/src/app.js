import express from "express";
import engineRoutes from "./routes/engine.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/engine", engineRoutes);

app.get("/", (req, res) => {
  res.send("ZORDON API rodando...");
});

export default app;