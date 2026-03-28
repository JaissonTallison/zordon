import { getProdutos, getVendas } from "../repositories/insights.repository.js";
import { gerarInsights } from "../engine/insights.engine.js";

export async function getInsights(req, res) {
  try {
    const produtos = await getProdutos();
    const vendas = await getVendas();

    const insights = gerarInsights(produtos, vendas);

    res.json(insights);
  } catch (error) {
    console.error("Erro ao gerar insights:", error);
    res.status(500).json({ error: "Erro ao gerar insights" });
  }
}