import { analisarProdutoParado } from "./rules/produtoParado.rule.js";
import { analisarEstoqueBaixo } from "./rules/estoqueBaixo.rule.js";
import { analisarProdutoAltaVenda } from "./rules/produtoAltaVenda.rule.js";

import { salvarResultados } from "../repositories/result.repository.js";

export function executarMotor(dados, empresaId) {
  const resultados = [];

  const { produtos, estoques, vendas } = dados;

  for (const produto of produtos) {
    const estoque = estoques.find(e => e.produto_id === produto.id);
    const vendasProduto = vendas.filter(v => v.produto_id === produto.id);

    const regras = [
      analisarProdutoParado,
      analisarEstoqueBaixo,
      analisarProdutoAltaVenda
    ];

    for (const regra of regras) {
      const resultado = regra(produto, estoque, vendasProduto);

      if (resultado) {
        resultados.push(resultado);
      }
    }
  }

  salvarResultados(resultados, empresaId);

  return resultados;
}