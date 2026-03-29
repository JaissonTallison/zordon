export default async function produtoParadoRule({ produtos, vendas }) {
  const resultados = [];
  const hoje = new Date();

  for (const produto of produtos) {
    const vendasProduto = vendas.filter(v => v.produto_id === produto.id);

    const ultimaVenda = vendasProduto.sort(
      (a, b) => new Date(b.data) - new Date(a.data)
    )[0];

    const diasSemVenda = ultimaVenda
      ? (hoje - new Date(ultimaVenda.data)) / (1000 * 60 * 60 * 24)
      : 999;

    if (diasSemVenda > 30 && produto.estoque > produto.minimo) {
      const valorUnitario = produto.valor || 0;
      const impactoFinanceiro = valorUnitario * produto.estoque;

      resultados.push({
        tipo: "problema",
        entidade: "produto",
        titulo: "Produto sem vendas",
        descricao: `${produto.nome} está há ${Math.floor(diasSemVenda)} dias sem vendas`,

        impacto: `R$ ${impactoFinanceiro.toFixed(2)} em capital parado`,
        recomendacao: "Criar campanha promocional ou aplicar desconto",
        prioridade: impactoFinanceiro > 1000 ? "alta" : "media"
      });
    }
  }

  return resultados;
}