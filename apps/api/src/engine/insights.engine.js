export function gerarInsights(produtos, vendas) {
  const insights = [];

  if (!produtos.length) return insights;

  //  Produto mais vendido
  const vendasPorProduto = {};

  vendas.forEach((v) => {
    vendasPorProduto[v.produto_id] =
      (vendasPorProduto[v.produto_id] || 0) + v.quantidade;
  });

  let maisVendido = null;
  let max = 0;

  produtos.forEach((p) => {
    const total = vendasPorProduto[p.id] || 0;

    if (total > max) {
      max = total;
      maisVendido = p;
    }
  });

  if (maisVendido) {
    insights.push({
      tipo: "sucesso",
      mensagem: `Produto mais vendido: ${maisVendido.nome} (${max} unidades)`,
    });
  }

  //  Estoque crítico
  const criticos = produtos.filter((p) => p.estoque <= p.minimo);

  if (criticos.length > 0) {
    insights.push({
      tipo: "alerta",
      mensagem: `${criticos.length} produto(s) com estoque crítico`,
    });
  }

  //  Produto sem venda
  const parados = produtos.filter(
    (p) => !vendasPorProduto[p.id]
  );

  if (parados.length > 0) {
    insights.push({
      tipo: "info",
      mensagem: `${parados.length} produto(s) sem vendas`,
    });
  }

  return insights;
}