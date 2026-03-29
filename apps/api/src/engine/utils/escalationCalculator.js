export function calcularEscalonamento(decisao) {
  const impactoMatch = decisao.impacto?.match(/R\$\s?([\d.]+)/);
  const impactoValor = impactoMatch ? parseFloat(impactoMatch[1]) : 0;

  const recorrencia = decisao.recorrencia || 0;

  let nivel = "BAIXO";
  let acao = "Monitorar situação";

  // CRÍTICO
  if (impactoValor > 1000 && recorrencia >= 3) {
    nivel = "CRITICO";
    acao = "Ação imediata necessária";
  }

  // ALTO
  else if (impactoValor > 500 && recorrencia >= 2) {
    nivel = "ALTO";
    acao = "Intervenção recomendada";
  }

  // MÉDIO
  else if (impactoValor > 100) {
    nivel = "MEDIO";
    acao = "Acompanhar de perto";
  }

  // BAIXO
  if (decisao.tipo === "oportunidade") {
    nivel = "BAIXO";
    acao = "Aproveitar oportunidade";
  }

  return {
    nivel,
    acao_recomendada: acao
  };
}