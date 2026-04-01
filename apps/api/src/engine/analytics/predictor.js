/**
 * Predictor do ZORDON
 * Antecipação de problemas futuros
 */

export function preverProblemas(decisions = []) {
  if (!Array.isArray(decisions)) {
    throw new Error("decisions deve ser um array");
  }

  const previsoes = [];

  for (const d of decisions) {
    /**
     * 1. ESTOQUE BAIXO COM ALTA DEMANDA
     */
    if (
      d.codigo === "PRODUTO_ALTA_DEMANDA" &&
      d.estoque <= d.minimo
    ) {
      previsoes.push({
        tipo: "risco_ruptura",
        descricao: "Produto pode faltar em breve",
        recomendacao: "Reabastecer estoque imediatamente",
        impacto_estimado: d.impacto_valor
      });
    }

    /**
     * 2. PRODUTO PARADO + RECORRÊNCIA
     */
    if (
      d.codigo === "PRODUTO_PARADO" &&
      d.recorrencia >= 2
    ) {
      previsoes.push({
        tipo: "risco_encalhe",
        descricao: "Produto tende a permanecer parado",
        recomendacao: "Ajustar estratégia de venda imediatamente",
        impacto_estimado: d.impacto_valor
      });
    }

    /**
     * 3. SCORE ALTO + CRESCENTE
     */
    if (Number(d.score_final) > 4000 && d.recorrencia >= 2) {
      previsoes.push({
        tipo: "problema_escalando",
        descricao: "Situação tende a piorar rapidamente",
        recomendacao: "Ação imediata recomendada",
        impacto_estimado: d.impacto_valor
      });
    }
  }

  return previsoes;
}