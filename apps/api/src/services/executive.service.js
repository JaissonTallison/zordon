/**
 * Executive Service do ZORDON
 * Responsável por gerar visão executiva do negócio
 */

export function gerarPainelExecutivo({ decisions = [], alerts = [] }) {
  /**
   * 1. RESUMO FINANCEIRO
   */
  const totalImpacto = decisions.reduce(
    (acc, d) => acc + Number(d.impacto_valor || 0),
    0
  );

  const prejuizos = decisions
    .filter((d) => d.tipo === "problema")
    .reduce((acc, d) => acc + Number(d.impacto_valor || 0), 0);

  const oportunidades = decisions
    .filter((d) => d.tipo === "oportunidade")
    .reduce((acc, d) => acc + Number(d.impacto_valor || 0), 0);

  /**
   * 2. TOP PRIORIDADES
   */
  const topPrioridades = [...decisions]
    .sort((a, b) => b.score_final - a.score_final)
    .slice(0, 5);

  /**
   * 3. ALERTAS IMPORTANTES
   */
  const alertasCriticos = alerts.filter(
    (a) => a.prioridade === "CRITICO" || a.tipo === "alto_impacto"
  );

  /**
   * 4. AÇÃO RECOMENDADA DO DIA
   */
  const melhorDecisao = topPrioridades[0] || null;

  const acaoPrincipal = melhorDecisao
    ? {
        titulo: melhorDecisao.descricao,
        impacto: melhorDecisao.impacto_valor,
        recomendacao:
          melhorDecisao?.estrategia?.recomendacao_principal || null
      }
    : null;

  /**
   * 5. RESUMO EXECUTIVO (mensagem)
   */
  const resumo = gerarResumo({
    prejuizos,
    oportunidades,
    melhorDecisao
  });

  return {
    resumo,

    financeiro: {
      impacto_total: totalImpacto,
      prejuizo_potencial: prejuizos,
      ganho_potencial: oportunidades
    },

    acao_principal: acaoPrincipal,

    top_prioridades: topPrioridades,

    alertas: alertasCriticos
  };
}

/**
 * GERA TEXTO EXECUTIVO
 */
function gerarResumo({ prejuizos, oportunidades, melhorDecisao }) {
  if (!melhorDecisao) {
    return "Nenhuma ação prioritária identificada hoje.";
  }

  return `
Hoje você possui R$ ${prejuizos} em possíveis perdas e R$ ${oportunidades} em oportunidades de ganho.
A principal ação recomendada é: ${melhorDecisao.descricao}.
  `.trim();
}