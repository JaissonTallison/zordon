import engine from "../engine/engine.js";

import { findAllProdutos } from "../repositories/produto.repository.js";
import vendaRepository from "../repositories/venda.repository.js";

import {
  salvarResultados,
  contarRecorrencia
} from "../repositories/result.repository.js";

import { calcularEscalonamento } from "../engine/utils/escalationCalculator.js";
import { normalizarDecisao } from "../engine/utils/normalizer.js";

// CORE
async function run({ empresaId }) {
  const produtos = await findAllProdutos();
  const vendas = await vendaRepository.getAll();

  let decisions = await engine({ produtos, vendas });

  decisions = decisions.map(normalizarDecisao);

  decisions = await Promise.all(
    decisions.map(async (d) => {
      const recorrencia = await contarRecorrencia({
        codigo: d.codigo,
        produto_id: d.produto_id,
        empresaId
      });

      const escalonamento = calcularEscalonamento({
        ...d,
        recorrencia
      });

      return {
        ...d,
        recorrencia,
        mensagem_recorrencia:
          recorrencia > 1
            ? `Problema ocorre há ${recorrencia} dias consecutivos`
            : null,
        ...escalonamento
      };
    })
  );

  await salvarResultados(decisions, empresaId);

  return decisions;
}

// CRON (EXPORT QUE FALTAVA)
export async function executarEngineAutomatico(empresaId = 1) {
  try {
    const decisions = await run({ empresaId });

    console.log(
      `ZORDON executado automaticamente (${decisions.length} decisões)`
    );
  } catch (error) {
    console.error("Erro no cron do ZORDON:", error);
  }
}

// export default continua
export default {
  run
};