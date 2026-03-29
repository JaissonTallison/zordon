import produtoParado from "./rules/produtoParado.rule.js";
import estoqueBaixo from "./rules/estoqueBaixo.rule.js";
import produtoAltoVenda from "./rules/produtoAltoVenda.rule.js";

import { calcularScore } from "./utils/scoreCalculator.js";

export default async function engine(data) {
  let resultados = [];

  const rules = [
    produtoParado,
    estoqueBaixo,
    produtoAltoVenda
  ];

  for (const rule of rules) {
    const res = await rule(data);

    if (Array.isArray(res)) {
      resultados = resultados.concat(res);
    }
  }

  const comScore = resultados.map((decisao) => ({
    ...decisao,
    score: calcularScore(decisao)
  }));

  return comScore.sort((a, b) => b.score - a.score);
}