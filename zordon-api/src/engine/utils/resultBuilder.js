export function criarResultado({
  tipo,
  codigo,
  produto,
  titulo,
  descricao,
  impacto,
  prioridade,
  recomendacao,
  dados
}) {
  return {
    tipo,
    codigo,
    produto_id: produto.id,

    titulo,
    descricao,

    impacto,
    prioridade,

    recomendacao,

    dados,

    gerado_em: new Date()
  };
}