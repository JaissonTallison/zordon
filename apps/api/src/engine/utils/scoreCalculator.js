/**
 * Calcula score da decisão com base em:
 * - impacto financeiro real
 * - prioridade
 * - tipo (problema > oportunidade)
 */
export function calcularScore(decisao) {
  let score = 0;

  /**
   * 1. Impacto financeiro (principal fator)
   */
  const impacto = Number(decisao.impacto_valor || 0);

  score += impacto;

  /**
   * 2. Prioridade
   */
  const prioridadePeso = {
    CRITICO: 2000,
    ALTO: 1000,
    MEDIO: 500,
    BAIXO: 100
  };

  score += prioridadePeso[decisao.prioridade] || 0;

  /**
   * 3. Tipo de decisão
   */
  if (decisao.tipo === "problema") {
    score += 500;
  }

  /**
   * 4. Recorrência (quanto mais recorrente, mais crítico)
   */
  if (decisao.recorrencia) {
    score += decisao.recorrencia * 200;
  }

  return score;
}