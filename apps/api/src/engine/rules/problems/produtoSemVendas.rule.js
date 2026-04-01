export default function produtoSemVendasRule({ produtos = [], vendas = [] }) {
  const resultados = [];

  for (const produto of produtos) {
    const vendasProduto = vendas.filter(
      (v) => v.produto_id === produto.id
    );

    if (vendasProduto.length === 0) {
      const valor = Number(produto.valor || 0);
      const estoque = Number(produto.estoque || 0);

      // 🔥 fallback inteligente REAL
      let impacto = valor * estoque;

      if (impacto <= 0) {
        impacto = Math.max(
          estoque * 10,  // baseado em estoque
          100            // valor mínimo garantido
        );
      }

      resultados.push({
        tipo: "problema",
        entidade: "produto",
        produto_id: produto.id,
        codigo: "PRODUTO_SEM_VENDAS",

        titulo: "Produto sem vendas",
        descricao: `${produto.nome} está sem vendas`,

        impacto: "Capital parado",
        impacto_valor: impacto,

        recomendacao: {
          acao: "Criar campanha promocional ou aplicar desconto"
        },

        prioridade:
          impacto > 2000 ? "CRITICO" :
          impacto > 1000 ? "ALTO" :
          impacto > 300 ? "MEDIO" :
          "BAIXO",

        score: 500
      });
    }
  }

  return resultados;
}