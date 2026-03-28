type Produto = {
  nome: string;
  vendas: number;
  estoque: number;
  minimo: number;
};

export function gerarInsights(produtos: Produto[]) {
  if (!produtos.length) return [];

  const insights: string[] = [];

  //  Produto mais vendido
  const maisVendido = produtos.reduce((prev, atual) =>
    atual.vendas > prev.vendas ? atual : prev
  );

  insights.push(
    `📈 Produto mais vendido: ${maisVendido.nome} (${maisVendido.vendas} unidades)`
  );

  //  Produtos com estoque crítico
  const criticos = produtos.filter((p) => p.estoque <= p.minimo);

  if (criticos.length > 0) {
    insights.push(
      `⚠️ ${criticos.length} produto(s) com estoque crítico`
    );
  }

  //  Produto parado
  const parados = produtos.filter((p) => p.vendas === 0);

  if (parados.length > 0) {
    insights.push(
      `📦 ${parados.length} produto(s) sem vendas`
    );
  }

  //  Oportunidade
  if (maisVendido.estoque > maisVendido.minimo) {
    insights.push(
      `💡 Oportunidade: criar promoções para ${maisVendido.nome}`
    );
  }

  return insights;
}