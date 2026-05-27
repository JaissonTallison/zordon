/**
 * ZORDON — RuleEvaluator
 * Avalia regras dinâmicas armazenadas no banco de dados.
 *
 * Estrutura de condição (JSONB):
 * {
 *   "operador": "AND" | "OR",
 *   "condicoes": [
 *     { "campo": "diasSemVenda", "op": ">",  "valor": 30 },
 *     { "campo": "estoque",     "op": "<=", "campo2": "minimo" },
 *     { "campo": "mediaVendas30d", "op": ">", "campo2": "mediaVendas90d", "multiplicador": 1.3 }
 *   ]
 * }
 */

// ─────────────────────────────────────────────────────────
// OPERADORES SUPORTADOS
// ─────────────────────────────────────────────────────────
const OPS = {
  ">":  (a, b) => a > b,
  ">=": (a, b) => a >= b,
  "<":  (a, b) => a < b,
  "<=": (a, b) => a <= b,
  "=":  (a, b) => a === b,
  "!=": (a, b) => a !== b,
};

// ─────────────────────────────────────────────────────────
// RESOLVER CAMPO NO CONTEXTO
// ─────────────────────────────────────────────────────────
function resolverCampo(campo, ctx) {
  if (campo in ctx) return Number(ctx[campo]);
  return null;
}

// ─────────────────────────────────────────────────────────
// AVALIAR UMA CONDIÇÃO ATÔMICA
// ─────────────────────────────────────────────────────────
function avaliarCondicao(cond, ctx) {
  const a = resolverCampo(cond.campo, ctx);
  if (a === null) return false;

  let b;
  if (cond.campo2 !== undefined) {
    b = resolverCampo(cond.campo2, ctx);
    if (b === null) return false;
    b = b * (cond.multiplicador || 1);
  } else {
    b = Number(cond.valor);
  }

  const fn = OPS[cond.op];
  if (!fn) {
    console.warn(`[RuleEvaluator] Operador desconhecido: ${cond.op}`);
    return false;
  }

  return fn(a, b);
}

// ─────────────────────────────────────────────────────────
// AVALIAR BLOCO DE CONDIÇÕES (AND / OR)
// ─────────────────────────────────────────────────────────
function avaliarBloco(bloco, ctx) {
  if (!bloco || !Array.isArray(bloco.condicoes)) return false;

  const op = (bloco.operador || "AND").toUpperCase();

  if (op === "OR") {
    return bloco.condicoes.some((c) =>
      c.condicoes ? avaliarBloco(c, ctx) : avaliarCondicao(c, ctx)
    );
  }

  return bloco.condicoes.every((c) =>
    c.condicoes ? avaliarBloco(c, ctx) : avaliarCondicao(c, ctx)
  );
}

// ─────────────────────────────────────────────────────────
// MONTAR CONTEXTO A PARTIR DE PRODUTO + VENDAS
// ─────────────────────────────────────────────────────────
function montarContexto(produto, vendas) {
  const hoje = new Date();
  const vendasProduto = vendas.filter((v) => v.produto_id === produto.id);

  // Última venda
  const vendasOrdenadas = [...vendasProduto].sort(
    (a, b) => new Date(b.data) - new Date(a.data)
  );
  const ultimaVenda = vendasOrdenadas[0];
  const diasSemVenda = ultimaVenda
    ? (hoje - new Date(ultimaVenda.data)) / (1000 * 60 * 60 * 24)
    : 999;

  // Médias de vendas
  const corte30  = new Date(hoje - 30  * 86400 * 1000);
  const corte90  = new Date(hoje - 90  * 86400 * 1000);

  const qtd30d = vendasProduto
    .filter((v) => new Date(v.data) >= corte30)
    .reduce((s, v) => s + Number(v.quantidade || 1), 0);

  const qtd90d = vendasProduto
    .filter((v) => new Date(v.data) >= corte90)
    .reduce((s, v) => s + Number(v.quantidade || 1), 0);

  const mediaVendas30d = qtd30d / 30;
  const mediaVendas90d = qtd90d > 0 ? qtd90d / 90 : 0.01; // evita divisão por 0

  const variacao = mediaVendas90d > 0
    ? Math.round(((mediaVendas30d - mediaVendas90d) / mediaVendas90d) * 100)
    : 0;

  return {
    // Produto
    id:           produto.id,
    nome:         produto.nome,
    valor:        Number(produto.valor  || 0),
    estoque:      Number(produto.estoque || 0),
    minimo:       Number(produto.minimo  || 0),
    categoria:    produto.categoria || "",

    // Temporais
    diasSemVenda: Math.floor(diasSemVenda),

    // Métricas de venda
    mediaVendas30d,
    mediaVendas90d,
    qtd30d,
    qtd90d,
    variacao,
  };
}

// ─────────────────────────────────────────────────────────
// CALCULAR IMPACTO COM BASE NA FÓRMULA
// ─────────────────────────────────────────────────────────
function calcularImpacto(formula, ctx) {
  if (!formula) return 0;

  try {
    // Substitui variáveis simples pelo valor numérico
    const expr = formula.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, (key) => {
      const val = ctx[key];
      return val !== undefined ? Number(val) : 0;
    });

    // eslint-disable-next-line no-new-func
    const resultado = new Function(`return (${expr})`)();
    return isFinite(resultado) ? Math.max(0, Number(resultado.toFixed(2))) : 0;
  } catch {
    return 0;
  }
}

// ─────────────────────────────────────────────────────────
// RENDERIZAR TEMPLATE DE TEXTO
// ─────────────────────────────────────────────────────────
function renderizar(template, ctx, impacto_valor) {
  if (!template) return "";

  return template.replace(/\{([^}]+)\}/g, (_, key) => {
    if (key === "impacto_valor") return formatarMoeda(impacto_valor);
    if (key === "variacao") {
      const v = ctx.variacao || 0;
      return `${v > 0 ? "+" : ""}${v}%`;
    }
    return ctx[key] !== undefined ? ctx[key] : `{${key}}`;
  });
}

function formatarMoeda(v) {
  return Number(v || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ─────────────────────────────────────────────────────────
// AVALIAR UMA REGRA DB CONTRA TODOS OS PRODUTOS
// ─────────────────────────────────────────────────────────
function avaliarRegra(regra, produtos, vendas) {
  const resultados = [];

  for (const produto of produtos) {
    const ctx = montarContexto(produto, vendas);

    let bloco;
    try {
      bloco = typeof regra.condicoes === "string"
        ? JSON.parse(regra.condicoes)
        : regra.condicoes;
    } catch {
      console.warn(`[RuleEvaluator] Condições inválidas na regra ${regra.codigo}`);
      continue;
    }

    if (!avaliarBloco(bloco, ctx)) continue;

    const impacto_valor = calcularImpacto(regra.impacto_formula, ctx);

    resultados.push({
      tipo:         regra.tipo,
      entidade:     regra.escopo || "produto",
      produto_id:   produto.id,
      produto_nome: produto.nome,
      codigo:       regra.codigo,

      titulo:           renderizar(regra.titulo_template,       ctx, impacto_valor),
      descricao:        renderizar(regra.descricao_template,    ctx, impacto_valor),
      recomendacao: {
        acao: renderizar(regra.recomendacao_template, ctx, impacto_valor),
      },

      impacto_valor,
      prioridade:   regra.prioridade || "MEDIA",
      score:        impacto_valor * (Number(regra.peso) || 1),
      origem:       "db",  // marca para distinguir de regras hardcoded

      _ctx: ctx,  // para debug / explainability
    });
  }

  return resultados;
}

// ─────────────────────────────────────────────────────────
// EXPORTAR AVALIADOR COMPLETO
// ─────────────────────────────────────────────────────────
export { avaliarRegra, montarContexto, avaliarBloco, calcularImpacto };

export default async function avaliarRegrasDB(regrasList, { produtos, vendas }) {
  const resultados = [];

  for (const regra of regrasList) {
    if (!regra.ativa) continue;

    try {
      const res = avaliarRegra(regra, produtos, vendas);
      resultados.push(...res);
    } catch (err) {
      console.error(`[RuleEvaluator] Erro na regra ${regra.codigo}:`, err.message);
    }
  }

  return resultados;
}
