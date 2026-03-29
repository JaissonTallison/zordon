export default async function produtoAltoVendaRule({ produtos, vendas }) {
  const resultados = [];

  const vendasPorProduto = {};

  // Agrupar vendas por produto
  for (const venda of vendas) {
    if (!vendasPorProduto[venda.produto_id]) {
      vendasPorProduto[venda.produto_id] = 0;
    }

    vendasPorProduto[venda.produto_id] += venda.quantidade;
  }

  // Encontrar média de vendas
  const valores = Object.values(vendasPorProduto);

  if (valores.length === 0) return [];

  const media =
    valores.reduce((acc, val) => acc + val, 0) / valores.length;

  for (const produto of produtos) {
    const totalVendido = vendasPorProduto[produto.id] || 0;

    if (totalVendido > media * 1.5) {
      resultados.push({
        tipo: "oportunidade",
        entidade: "produto",
        titulo: "Produto com alta demanda",
        descricao: `${produto.nome} está vendendo acima da média (${totalVendido} unidades)`,

        impacto: "Alta demanda pode gerar aumento de faturamento",
        recomendacao:
          "Aumentar estoque, priorizar reposição e considerar campanhas para escalar vendas",
        prioridade: "media"
      });
    }
  }

  return resultados;
}