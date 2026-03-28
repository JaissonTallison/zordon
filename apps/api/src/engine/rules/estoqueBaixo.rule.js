import { criarResultado } from "../utils/resultBuilder.js";

export function analisarEstoqueBaixo(produto, estoque, vendas) {
  const LIMITE_ESTOQUE_BAIXO = 20;
  const PERIODO_DIAS = 30;
  const LIMITE_VENDAS = 30;

  const hoje = new Date();
  const dataLimite = new Date();
  dataLimite.setDate(hoje.getDate() - PERIODO_DIAS);

  const vendasRecentes = vendas.filter(v => {
    return new Date(v.data) >= dataLimite;
  });

  const totalVendas = vendasRecentes.reduce((total, venda) => {
    return total + venda.quantidade;
  }, 0);

  if (
    estoque &&
    estoque.quantidade < LIMITE_ESTOQUE_BAIXO &&
    totalVendas > LIMITE_VENDAS
  ) {
    return criarResultado({
      tipo: "PROBLEMA",
      codigo: "ESTOQUE_BAIXO",
      produto,
      titulo: "Risco de ruptura de estoque",
      descricao: `${produto.nome} possui alta saída e estoque baixo`,
      impacto: "Perda de vendas por indisponibilidade do produto",
      prioridade: calcularPrioridade(estoque.quantidade),
      recomendacao: {
        acao: "Repor estoque com urgência",
        tipo: "OPERACIONAL"
      },
      dados: {
        estoque: estoque.quantidade,
        vendas: totalVendas
      }
    });
  }

  return null;
}

function calcularPrioridade(qtd) {
  if (qtd < 5) return "ALTA";
  if (qtd < 10) return "MEDIA";
  return "BAIXA";
}