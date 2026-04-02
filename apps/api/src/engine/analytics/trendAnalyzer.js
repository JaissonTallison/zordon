export function analisarTendencias(historico = []) {
  const tendencias = [];

  const mapa = {};

  for (const h of historico) {
    mapa[h.codigo] = (mapa[h.codigo] || 0) + 1;
  }

  for (const codigo in mapa) {
    if (mapa[codigo] >= 3) {
      tendencias.push({
        tipo: "tendencia",
        titulo: "Padrão recorrente identificado",
        descricao: `${codigo} aparece com frequência`,
        intensidade: mapa[codigo],
        impacto: mapa[codigo] * 100
      });
    }
  }

  return tendencias;
  
}