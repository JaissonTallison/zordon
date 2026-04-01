export default function quedaVendasPrediction({ produtos = [], vendas = [] }) {
  const resultados = [];

  for (const produto of produtos) {
    const vendasProduto = vendas
      .filter((v) => v.produto_id === produto.id)
      .sort((a, b) => new Date(a.data) - new Date(b.data));

    if (vendasProduto.length < 3) continue;

    const ultimas = vendasProduto.slice(-3);
    const q = ultimas.map(v => Number(v.quantidade || 0));

    const queda = q[0] > q[1] && q[1] > q[2];
    if (!queda) continue;

    const valor = Number(produto.valor || 0);
    const estoque = Number(produto.estoque || 0);

    resultados.push({
      tipo: "previsao",
      entidade: "produto",
      produto_id: produto.id,
      codigo: "QUEDA_VENDAS_PREVISTA",

      titulo: "Queda de vendas prevista",
      descricao: `${produto.nome} apresenta queda nas últimas vendas`,

      impacto: "Possível queda de receita",
      impacto_valor: valor * estoque,

      recomendacao: {
        acao: "Revisar preço ou iniciar campanha"
      },

      prioridade: "MEDIO",
      score: 350
    });
  }

  return resultados;
}