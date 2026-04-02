import { analisarTendencias } from "../engine/analytics/trendAnalyzer.js";
import { preverProblemas } from "../engine/analytics/predictor.js";
import { simularCenarios } from "../engine/analytics/scenarioSimulator.js";

function somarImpacto(decisions = []) {
  return decisions.reduce(
    (acc, d) => acc + Number(d.impacto_valor || 0),
    0
  );
}

export function montarInteligencia({ decisions = [], historico = [] }) {
  if (!Array.isArray(decisions)) decisions = [];
  if (!Array.isArray(historico)) historico = [];

  const problemas = decisions.filter(d => d.tipo === "problema");
  const oportunidades = decisions.filter(d => d.tipo === "oportunidade");
  const alertas = decisions.filter(d => d.tipo === "alerta");

  const ordenado = [...decisions].sort(
    (a, b) => Number(b.score_final || 0) - Number(a.score_final || 0)
  );

  return {
    resumo: {
      impacto_total: somarImpacto(decisions),
      problemas: problemas.length,
      oportunidades: oportunidades.length,
      alertas: alertas.length
    },

    decisoes: {
      problemas,
      oportunidades,
      alertas
    },

    insights: {
      tendencias: analisarTendencias(historico),
      previsoes: preverProblemas(decisions),
      cenarios: simularCenarios(decisions)
    },

    top: ordenado.slice(0, 5),

    recomendacao_principal: ordenado[0] || null
  };
}