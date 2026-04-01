export default function estoqueBaixoRule({ produtos = [] }) {
  const resultados = [];

  for (const produto of produtos) {
    const estoque = Number(produto.estoque || 0);
    const minimo = Number(produto.minimo || 0);
    const valor = Number(produto.valor || 0);

    if (estoque <= minimo) {
      const impacto = valor * minimo;

      resultados.push({
        tipo: "alerta",
        entidade: "produto",
        produto_id: produto.id,
        codigo: "ESTOQUE_BAIXO",

        titulo: "Estoque baixo",
        descricao: `${produto.nome} com estoque crítico (${estoque})`,

        impacto: "Risco de ruptura",
        impacto_valor: impacto || 0,

        recomendacao: {
          acao: "Repor estoque imediatamente"
        },

        prioridade: estoque === 0 ? "CRITICO" : "ALTO",
        score: 600
      });
    }
  }

  return resultados;
}