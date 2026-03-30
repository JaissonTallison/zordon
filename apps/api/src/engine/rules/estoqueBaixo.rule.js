export default async function estoqueBaixoRule({ produtos }) {
  const resultados = [];

  for (const produto of produtos) {
    if (produto.estoque <= produto.minimo) {
      const valorUnitario = produto.valor || 0;

      // cálculo real
      const impactoValor = valorUnitario * produto.minimo;

      resultados.push({
        tipo: "problema",
        entidade: "produto",
        titulo: "Estoque baixo",
        descricao: `${produto.nome} com estoque crítico (${produto.estoque})`,

        // TEXTO (UI)
        impacto: "Possível perda em vendas",

        // VALOR REAL (INTELIGÊNCIA)
        impacto_valor: impactoValor,

        recomendacao: {
          acao: "Repor estoque imediatamente"
        },

        prioridade: produto.estoque === 0 ? "CRITICO" : "ALTO",

        dados: produto,
        gerado_em: new Date()
      });
    }
  }

  return resultados;
}