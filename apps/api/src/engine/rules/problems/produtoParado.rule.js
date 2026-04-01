export default function produtoParadoRule({ produtos = [], vendas = [] }) {
  const resultados = [];
  const hoje = new Date();

  for (const produto of produtos) {
    const vendasProduto = vendas.filter(
      (v) => v.produto_id === produto.id
    );

    if (vendasProduto.length === 0) continue;

    const ultimaVenda = vendasProduto
      .sort((a, b) => new Date(b.data) - new Date(a.data))[0];

    const diasSemVenda = ultimaVenda
      ? (hoje - new Date(ultimaVenda.data)) / (1000 * 60 * 60 * 24)
      : 0;

    const valor = Number(produto.valor || 0);
    const estoque = Number(produto.estoque || 0);
    const minimo = Number(produto.minimo || 0);

    // REGRA REAL
    if (diasSemVenda > 30 && estoque > minimo) {
      const impacto = valor * estoque;

      resultados.push({
        tipo: "problema",
        entidade: "produto",
        produto_id: produto.id,
        codigo: "PRODUTO_PARADO",

        titulo: "Produto parado",
        descricao: `${produto.nome} está há ${Math.floor(diasSemVenda)} dias sem vendas`,

        impacto: "Capital parado",
        impacto_valor: impacto || 0,

        recomendacao: {
          acao: "Criar campanha promocional ou aplicar desconto"
        },

        prioridade: impacto > 1000 ? "ALTO" : "MEDIO",
        score: 400
      });
    }
  }

  return resultados;
}