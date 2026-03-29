export function calcularScore(decisao) {
  let score = 0;

  // 1. Impacto financeiro (extrair número do texto)
  const match = decisao.impacto.match(/R\$\s?([\d.]+)/);

  if (match) {
    const valor = parseFloat(match[1]);
    score += valor;
  }

  // 2. Prioridade
  const prioridadePeso = {
    alta: 1000,
    media: 500,
    baixa: 100
  };

  score += prioridadePeso[decisao.prioridade] || 0;

  // 3. Tipo (problema pesa mais que oportunidade)
  if (decisao.tipo === "problema") {
    score += 300;
  }

  return score;
}