/**
 * Strategy Engine do ZORDON
 * Responsável por transformar decisões técnicas em raciocínio estratégico
 */

export default function strategyEngine(decisions = []) {
  if (!Array.isArray(decisions)) {
    throw new Error("Decisions deve ser um array");
  }

  return decisions.map((d) => {
    /**
     * 1. DIAGNÓSTICO
     */
    const diagnostico = gerarDiagnostico(d);

    /**
     * 2. ESTRATÉGIAS POSSÍVEIS
     */
    const estrategias = gerarEstrategias(d);

    /**
     * 3. RECOMENDAÇÃO PRINCIPAL
     */
    const recomendacao_principal = escolherMelhorEstrategia(estrategias);

    return {
      ...d,

      estrategia: {
        diagnostico,
        estrategias,
        recomendacao_principal
      }
    };
  });
}

/**
 * DIAGNÓSTICO
 */
function gerarDiagnostico(decisao) {
  if (decisao.codigo === "PRODUTO_PARADO") {
    return "Produto com baixo giro, indicando capital parado e possível desalinhamento com a demanda";
  }

  if (decisao.codigo === "ESTOQUE_BAIXO") {
    return "Estoque insuficiente para atender a demanda atual, risco de perda de vendas";
  }

  if (decisao.codigo === "PRODUTO_ALTA_DEMANDA") {
    return "Produto com alta demanda, oportunidade de maximizar receita";
  }

  return "Situação requer análise estratégica";
}

/**
 * ESTRATÉGIAS POSSÍVEIS
 */
function gerarEstrategias(decisao) {
  switch (decisao.codigo) {
    case "PRODUTO_PARADO":
      return [
        {
          estrategia: "acelerar_saida",
          descricao: "Reduzir tempo de venda do produto",
          acoes: [
            "Aplicar desconto controlado",
            "Criar campanha promocional",
            "Reposicionar produto"
          ]
        },
        {
          estrategia: "reposicionar",
          descricao: "Alterar abordagem de venda",
          acoes: [
            "Mudar público-alvo",
            "Revisar apresentação",
            "Melhorar marketing"
          ]
        },
        {
          estrategia: "desmobilizar",
          descricao: "Liberar capital investido",
          acoes: [
            "Liquidar produto",
            "Vender com margem reduzida"
          ]
        }
      ];

    case "ESTOQUE_BAIXO":
      return [
        {
          estrategia: "reabastecer",
          descricao: "Garantir continuidade das vendas",
          acoes: [
            "Comprar mais unidades",
            "Negociar com fornecedor"
          ]
        }
      ];

    case "PRODUTO_ALTA_DEMANDA":
      return [
        {
          estrategia: "maximizar_receita",
          descricao: "Aproveitar demanda alta",
          acoes: [
            "Aumentar preço gradualmente",
            "Aumentar estoque",
            "Criar campanhas de venda"
          ]
        }
      ];

    default:
      return [
        {
          estrategia: "avaliar",
          descricao: "Necessário análise manual",
          acoes: ["Revisar dados"]
        }
      ];
  }
}

/**
 * ESCOLHA DA MELHOR ESTRATÉGIA
 */
function escolherMelhorEstrategia(estrategias) {
  // regra simples inicial (pode evoluir depois)
  return estrategias[0];
}