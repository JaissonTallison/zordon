export default async function estoqueBaixoRule({ produtos }) {
  const resultados = [];

  for (const produto of produtos) {
    if (produto.estoque <= produto.minimo) {
      const valorUnitario = produto.valor || 0;
      const impacto = valorUnitario * produto.minimo;

      resultados.push({
        tipo: "problema",
        entidade: "produto",
        titulo: "Estoque baixo",
        descricao: `${produto.nome} com estoque crítico (${produto.estoque})`,

        impacto: `Possível perda de R$ ${impacto.toFixed(2)} em vendas`,
        recomendacao: "Repor estoque imediatamente",
        prioridade: produto.estoque === 0 ? "alta" : "media"
      });
    }
  }

  return resultados;
}