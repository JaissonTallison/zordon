export function calcularEscalonamento(decision) {
  const { impacto_valor = 0, recorrencia = 0 } = decision;

  let nivel = "BAIXO";
  let acao_recomendada = "Monitorar situação";

  // REGRA PRINCIPAL: impacto financeiro
  if (impacto_valor >= 1000) {
    nivel = "ALTO";
    acao_recomendada = "Ação imediata necessária";
  } else if (impacto_valor >= 300) {
    nivel = "MEDIO";
    acao_recomendada = "Planejar ação";
  }

  // REGRA DE RECORRÊNCIA (override)
  if (recorrencia >= 3) {
    nivel = "CRITICO";
    acao_recomendada = "Intervenção urgente";
  }

  return {
    nivel,
    acao_recomendada
  };
}