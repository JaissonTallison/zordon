export function normalizarDecisao(d) {
  const impactoNumerico =
    typeof d.impacto_valor === "number"
      ? d.impacto_valor
      : extrairValor(d.impacto);

  return {
    ...d,

    codigo:
      d.codigo ||
      d.titulo?.toUpperCase().replace(/\s+/g, "_"),

    produto_id:
      d.produto_id ||
      d.dados?.id ||
      null,

    prioridade: normalizarPrioridade(d.prioridade),

    // GARANTE NÚMERO REAL
    impacto_valor: Number(impactoNumerico || 0),

    score: Number(d.score || 0),

    recomendacao:
      typeof d.recomendacao === "string"
        ? { acao: d.recomendacao }
        : d.recomendacao || {},
  };
}

function normalizarPrioridade(p) {
  if (!p) return "MEDIO";

  const val = p.toUpperCase();

  if (val.includes("CRIT")) return "CRITICO";
  if (val.includes("ALTO")) return "ALTO";
  if (val.includes("MED")) return "MEDIO";
  if (val.includes("BAIX")) return "BAIXO";

  return "MEDIO";
}

function extrairValor(texto) {
  if (!texto) return 0;

  const match = texto.match(/\d+/g);

  if (!match) return 0;

  return Number(match.join(""));
}