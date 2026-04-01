export default function produtoAltoVendaRule({ produtos = [], vendas = [] }) {
  const resultados = [];
  const vendasPorProduto = {};

  for (const venda of vendas) {
    const qtd = Number(venda.quantidade || 0);

    vendasPorProduto[venda.produto_id] =
      (vendasPorProduto[venda.produto_id] || 0) + qtd;
  }

  const valores = Object.values(vendasPorProduto);
  if (valores.length === 0) return [];

  const media =
    valores.reduce((acc, val) => acc + val, 0) / valores.length;

  for (const produto of produtos) {
    const total = vendasPorProduto[produto.id] || 0;
    const valor = Number(produto.valor || 0);

    if (total > media * 1.5) {
      resultados.push({
        tipo: "oportunidade",
        entidade: "produto",
        produto_id: produto.id,
        codigo: "PRODUTO_ALTA_DEMANDA",

        titulo: "Alta demanda detectada",
        descricao: `${produto.nome} vende acima da média (${total})`,

        impacto: "Aumento potencial de receita",
        impacto_valor: total * valor,

        recomendacao: {
          acao: "Aumentar estoque e investir em marketing"
        },

        prioridade: "MEDIO",
        score: 300
      });
    }
  }

  return resultados;
}