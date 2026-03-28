import { criarResultado } from "../utils/resultBuilder.js";

export function analisarProdutoAltaVenda(produto, estoque, vendas) {
  const PERIODO_DIAS = 30;
  const LIMITE_VENDAS_ALTA = 50;

  const hoje = new Date();
  const dataLimite = new Date();
  dataLimite.setDate(hoje.getDate() - PERIODO_DIAS);

  const vendasRecentes = vendas.filter(v => {
    return new Date(v.data) >= dataLimite;
  });

  const totalVendas = vendasRecentes.reduce((total, venda) => {
    return total + venda.quantidade;
  }, 0);

  if (totalVendas >= LIMITE_VENDAS_ALTA) {
    return criarResultado({
      tipo: "OPORTUNIDADE",
      codigo: "ALTA_VENDA",
      produto,
      titulo: "Produto com alta demanda",
      descricao: `${produto.nome} apresenta forte volume de vendas`,
      impacto: `Potencial de receita: R$ ${produto.preco * totalVendas}`,
      prioridade: "ALTA",
      recomendacao: {
        acao: "Aumentar estoque e intensificar marketing",
        tipo: "ESTRATEGICO"
      },
      dados: {
        estoque: estoque ? estoque.quantidade : 0,
        vendas: totalVendas
      }
    });
  }

  return null;
}