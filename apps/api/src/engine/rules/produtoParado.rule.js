import { criarResultado } from "../utils/resultBuilder.js";

export function analisarProdutoParado(produto, estoque, vendas) {
  const LIMITE_ESTOQUE = 100;
  const PERIODO_DIAS = 30;

  const hoje = new Date();
  const dataLimite = new Date();
  dataLimite.setDate(hoje.getDate() - PERIODO_DIAS);

  const vendasRecentes = vendas.filter(v => {
    return new Date(v.data) >= dataLimite;
  });

  const totalVendas = vendasRecentes.reduce((total, venda) => {
    return total + venda.quantidade;
  }, 0);

  if (totalVendas === 0 && estoque && estoque.quantidade > LIMITE_ESTOQUE) {
    return criarResultado({
      tipo: "PROBLEMA",
      codigo: "PRODUTO_PARADO",
      produto,
      titulo: "Produto sem saída",
      descricao: `${produto.nome} não teve vendas nos últimos 30 dias`,
      impacto: `R$ ${produto.preco * estoque.quantidade} em capital parado`,
      prioridade: "MEDIA",
      recomendacao: {
        acao: "Criar campanha promocional",
        tipo: "COMERCIAL"
      },
      dados: {
        estoque: estoque.quantidade,
        vendas: totalVendas
      }
    });
  }

  return null;
}