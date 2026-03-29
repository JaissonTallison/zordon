import engine from "../engine/engine.js";

import { findAllProdutos } from "../repositories/produto.repository.js";
import vendaRepository from "../repositories/venda.repository.js";

import {
  salvarResultados,
  contarRecorrencia
} from "../repositories/result.repository.js";

import { calcularEscalonamento } from "../engine/utils/escalationCalculator.js";

import { processarAlertas } from "./alert.service.js";

/**
 * Executa análise automática (usado pelo cron)
 */
export async function executarEngineAutomatico(empresaId = 1) {
  try {
    // Buscar dados
    const produtos = await findAllProdutos();
    const vendas = await vendaRepository.getAll();

    // Rodar engine
    let decisions = await engine({ produtos, vendas });

    // Adicionar recorrência + escalonamento
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

    // Persistir resultados
    await salvarResultados(decisions, empresaId);

    // Processar alertas automáticos
    await processarAlertas(decisions, empresaId);

    // Log final
    console.log(
      `ZORDON executado automaticamente (${decisions.length} decisões)`
    );

  } catch (error) {
    console.error("Erro no cron do ZORDON:", error);
  }
}