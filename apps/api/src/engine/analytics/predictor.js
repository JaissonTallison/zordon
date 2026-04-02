export function preverProblemas(decisions = []) {
  if (!Array.isArray(decisions)) return [];

  const previsoes = [];

  for (const d of decisions) {

    // QUALQUER PROBLEMA COM IMPACTO ALTO
    if (d.tipo === "problema" && Number(d.impacto_valor) > 500) {
      previsoes.push({
        tipo: "risco_financeiro",
        titulo: "Impacto financeiro relevante detectado",
        descricao: `${d.titulo} pode gerar perdas contínuas`,
        impacto_estimado: d.impacto_valor
      });
    }

    // SCORE ALTO
    if (Number(d.score_final) > 800) {
      previsoes.push({
        tipo: "prioridade_critica",
        titulo: "Ação urgente necessária",
        descricao: `${d.titulo} exige atenção imediata`,
        impacto_estimado: d.impacto_valor
      });
    }
  }

  return previsoes;
}