/**
 * Alert Engine do ZORDON
 * Responsável por filtrar decisões relevantes e gerar alertas inteligentes
 */

export default function alertEngine(decisions = []) {
  if (!Array.isArray(decisions)) {
    throw new Error("Decisions deve ser um array");
  }

  const alerts = [];

  for (const d of decisions) {
    /**
     * REGRA 1: ALTO IMPACTO FINANCEIRO
     */
    if (Number(d.impacto_valor) > 10000) {
      alerts.push(criarAlerta(d, "alto_impacto"));
      continue;
    }

    /**
     * REGRA 2: PRIORIDADE CRÍTICA
     */
    if (d.prioridade === "CRITICO") {
      alerts.push(criarAlerta(d, "critico"));
      continue;
    }

    /**
     * REGRA 3: PROBLEMA RECORRENTE
     */
    if (d.recorrencia && d.recorrencia >= 3) {
      alerts.push(criarAlerta(d, "recorrente"));
      continue;
    }

    /**
     * REGRA 4: SCORE MUITO ALTO
     */
    if (Number(d.score_final) > 5000) {
      alerts.push(criarAlerta(d, "prioridade_alta"));
      continue;
    }
  }

  return alerts;
}

/**
 * CRIADOR DE ALERTA
 */
function criarAlerta(decisao, tipo) {
  return {
    tipo,

    titulo: gerarTitulo(decisao),

    descricao: gerarDescricao(decisao),

    impacto_valor: decisao.impacto_valor,

    prioridade: decisao.prioridade,

    recomendacao: decisao?.estrategia?.recomendacao_principal || null,

    criado_em: new Date()
  };
}

/**
 * GERA TÍTULO
 */
function gerarTitulo(d) {
  switch (d.codigo) {
    case "PRODUTO_PARADO":
      return "Produto parado gerando prejuízo";

    case "ESTOQUE_BAIXO":
      return "Risco de perda de vendas";

    case "PRODUTO_ALTA_DEMANDA":
      return "Oportunidade de aumento de receita";

    default:
      return "Alerta estratégico";
  }
}

/**
 * GERA DESCRIÇÃO
 */
function gerarDescricao(d) {
  return `${d.descricao || "Situação identificada"} (Impacto estimado: R$ ${d.impacto_valor})`;
}