/**
 * Trend Analyzer do ZORDON
 * Analisa histórico de resultados e identifica tendências
 */

export function analisarTendencias(resultados = []) {
  if (!Array.isArray(resultados)) {
    throw new Error("resultados deve ser um array");
  }

  const tendencias = [];

  const agrupadoPorCodigo = agruparPorCodigo(resultados);

  for (const codigo in agrupadoPorCodigo) {
    const lista = agrupadoPorCodigo[codigo];

    const tendencia = calcularTendencia(lista);

    if (tendencia) {
      tendencias.push({
        codigo,
        ...tendencia
      });
    }
  }

  return tendencias;
}

/**
 * Agrupa por tipo de decisão
 */
function agruparPorCodigo(resultados) {
  return resultados.reduce((acc, item) => {
    if (!acc[item.codigo]) {
      acc[item.codigo] = [];
    }
    acc[item.codigo].push(item);
    return acc;
  }, {});
}

/**
 * Detecta tendência
 */
function calcularTendencia(lista) {
  if (lista.length < 3) return null;

  const ultimos = lista.slice(-3);

  const impactos = ultimos.map((i) => Number(i.impacto_valor || 0));

  const crescente =
    impactos[0] < impactos[1] && impactos[1] < impactos[2];

  const decrescente =
    impactos[0] > impactos[1] && impactos[1] > impactos[2];

  if (crescente) {
    return {
      tipo: "piora",
      descricao: "Impacto financeiro aumentando ao longo do tempo"
    };
  }

  if (decrescente) {
    return {
      tipo: "melhora",
      descricao: "Impacto financeiro reduzindo ao longo do tempo"
    };
  }

  return null;
}