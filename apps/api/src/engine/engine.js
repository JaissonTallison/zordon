import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RULES_PATH = path.join(__dirname, "rules");

const TIPOS = ["problems", "alerts", "opportunities", "predictions"];

/**
 * PESO DE PRIORIDADE
 */
function prioridadePeso(p) {
  const mapa = {
    CRITICO: 4,
    ALTO: 3,
    MEDIO: 2,
    BAIXO: 1
  };
  return mapa[p] || 0;
}

/**
 * ORDENAÇÃO INTELIGENTE
 */
function ordenar(lista) {
  return lista.sort((a, b) => {
    const prioridade = prioridadePeso(b.prioridade) - prioridadePeso(a.prioridade);
    if (prioridade !== 0) return prioridade;

    const impacto = (b.impacto_valor || 0) - (a.impacto_valor || 0);
    if (impacto !== 0) return impacto;

    return (b.score || 0) - (a.score || 0);
  });
}

/**
 * AGRUPAMENTO (APENAS AUXILIAR)
 */
function agrupar(decisoes) {
  return {
    problemas: ordenar(decisoes.filter(d => d.tipo === "problema")),
    alertas: ordenar(decisoes.filter(d => d.tipo === "alerta")),
    oportunidades: ordenar(decisoes.filter(d => d.tipo === "oportunidade")),
    previsoes: ordenar(decisoes.filter(d => d.tipo === "previsao"))
  };
}

/**
 * CARREGAR RULES DINAMICAMENTE
 */
async function carregarRules() {
  const rules = [];

  for (const tipo of TIPOS) {
    const pasta = path.join(RULES_PATH, tipo);

    if (!fs.existsSync(pasta)) continue;

    const arquivos = fs.readdirSync(pasta);

    for (const arquivo of arquivos) {
      if (!arquivo.endsWith(".js")) continue;

      const fullPath = path.join(pasta, arquivo);

      try {
        const module = await import(`file://${fullPath}`);
        const rule = module.default;

        if (typeof rule === "function") {
          rules.push(rule);
        } else {
          console.warn(`Rule inválida ignorada: ${arquivo}`);
        }
      } catch (err) {
        console.error(`Erro ao carregar rule ${arquivo}:`, err.message);
      }
    }
  }

  return rules;
}

/**
 * ENGINE PRINCIPAL
 */
export default async function engine(data) {
  try {
    const rules = await carregarRules();

    let resultados = [];

    for (const rule of rules) {
      try {
        const resultado = await rule(data);

        // GARANTE FORMATO CORRETO
        if (Array.isArray(resultado)) {
          resultados.push(...resultado);
        } else if (resultado && typeof resultado === "object") {
          resultados.push(resultado);
        }

      } catch (err) {
        console.error("Erro em rule:", err.message);
      }
    }

    // ORDENA RESULTADO FINAL
    resultados = ordenar(resultados);

    // AGRUPAMENTO OPCIONAL (NÃO QUEBRA O SISTEMA)
    const agrupado = agrupar(resultados);

    // ANEXA SEM QUEBRAR .map()
    Object.defineProperty(resultados, "_agrupado", {
      value: agrupado,
      enumerable: false // não aparece no JSON
    });

    return resultados;

  } catch (error) {
    console.error("Erro na engine:", error);
    return [];
  }
}