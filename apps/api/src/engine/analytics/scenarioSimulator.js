/**
 * Scenario Simulator do ZORDON
 * Simula impacto de ações antes de serem executadas
 */

export function simularCenarios(decisions = []) {
  if (!Array.isArray(decisions)) {
    throw new Error("decisions deve ser um array");
  }

  const cenarios = [];

  for (const d of decisions) {
    /**
     * PRODUTO PARADO → simular desconto
     */
    if (d.codigo === "PRODUTO_PARADO") {
      cenarios.push({
        codigo: d.codigo,
        tipo: "simulacao_desconto",
        atual: d.impacto_valor,

        simulacoes: [
          simularDesconto(d, 0.05),
          simularDesconto(d, 0.1)
        ]
      });
    }

    /**
     * ALTA DEMANDA → simular aumento de preço
     */
    if (d.codigo === "PRODUTO_ALTA_DEMANDA") {
      cenarios.push({
        codigo: d.codigo,
        tipo: "simulacao_preco",
        atual: d.impacto_valor,

        simulacoes: [
          simularAumentoPreco(d, 0.05),
          simularAumentoPreco(d, 0.1)
        ]
      });
    }
  }

  return cenarios;
}

/**
 * Simula desconto
 */
function simularDesconto(decisao, percentual) {
  const impactoAtual = Number(decisao.impacto_valor || 0);

  const ganhoEsperado = impactoAtual * (1 - percentual);

  return {
    acao: "reduzir_preco",
    percentual: percentual * 100 + "%",
    impacto_estimado: ganhoEsperado,
    descricao: `Aplicar desconto de ${percentual * 100}% pode acelerar vendas`
  };
}

/**
 * Simula aumento de preço
 */
function simularAumentoPreco(decisao, percentual) {
  const impactoAtual = Number(decisao.impacto_valor || 0);

  const ganhoEsperado = impactoAtual * (1 + percentual);

  return {
    acao: "aumentar_preco",
    percentual: percentual * 100 + "%",
    impacto_estimado: ganhoEsperado,
    descricao: `Aumentar preço em ${percentual * 100}% pode aumentar margem`
  };
}