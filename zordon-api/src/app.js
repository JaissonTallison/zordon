import express from "express";
import engineRoutes from "./routes/engine.routes.js";

const app = express();

app.use(express.json());

// rota principal
app.use("/api/engine", engineRoutes);

app.get("/", (req, res) => {
  res.send("ZORDON API rodando...");
});

export default app;