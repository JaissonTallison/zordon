export function normalizarDecisao(d) {
  return {
    ...d,

    // garante codigo
    codigo:
      d.codigo ||
      d.titulo?.toUpperCase().replace(/\s+/g, "_"),

    // garante produto_id
    produto_id:
      d.produto_id ||
      d.dados?.id ||
      null,

    // padroniza prioridade
    prioridade: normalizarPrioridade(d.prioridade),

    // garante número
    impacto_valor:
      typeof d.impacto_valor === "number"
        ? d.impacto_valor
        : extrairValor(d.impacto),

    // padroniza recomendação
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