import { useEffect, useState } from "react";
import useDecisionStore from "../store/useDecisionStore";
import DecisionCard from "../components/DecisionCard";
import ImpactChart from "../components/ImpactChart";

export default function Dashboard() {
  const {
    decisions,
    fetchDecisions,
    loading,
    applyDecision,
    ignoreDecision,
  } = useDecisionStore();

  const [modoFoco, setModoFoco] = useState(false);

  // TEMPO REAL (POLLING CONTROLADO)
  useEffect(() => {
    fetchDecisions();

    const interval = setInterval(() => {
      fetchDecisions();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchDecisions]);

  // PRIORIDADE
  const prioridadeOrdem = {
    CRITICO: 3,
    ALTO: 2,
    MEDIO: 1,
    BAIXO: 0,
  };

  const decisionsOrdenadas = [...decisions].sort(
    (a, b) => prioridadeOrdem[b.prioridade] - prioridadeOrdem[a.prioridade]
  );

  // MODO FOCO
  const listaFinal = modoFoco
    ? decisionsOrdenadas.filter((d) => d.prioridade === "CRITICO")
    : decisionsOrdenadas;

  // AGRUPAMENTO
  const problemas = listaFinal.filter((d) => d.tipo === "problema");
  const oportunidades = listaFinal.filter(
    (d) => d.tipo === "oportunidade"
  );

  const criticos = decisionsOrdenadas.filter(
    (d) => d.prioridade === "CRITICO"
  );

  // IMPACTO
  const calcularImpacto = (lista) => {
    return lista.reduce((total, d) => {
      return total + Number(d.impacto_valor || 0);
    }, 0);
  };

  const chartData = [
    {
      nome: "Problemas",
      valor: calcularImpacto(problemas),
    },
    {
      nome: "Oportunidades",
      valor: calcularImpacto(oportunidades),
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Central de Decisões
          </h1>
          <p className="text-gray-500 text-sm">
            O sistema está recomendando ações com impacto financeiro.
          </p>
        </div>

        <button
          onClick={() => setModoFoco(!modoFoco)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition"
        >
          {modoFoco ? "Mostrar todos" : "Modo foco"}
        </button>
      </div>

      {/* ALERTA CRÍTICO */}
      {criticos.length > 0 && (
        <div className="bg-red-600 text-white p-4 rounded-xl shadow-md animate-pulse">
          🚨 {criticos.length} decisão(ões) crítica(s) exigem ação imediata
        </div>
      )}

      {/* MÉTRICAS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Problemas</p>
          <h2 className="text-2xl font-bold text-red-500">
            {problemas.length}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Oportunidades</p>
          <h2 className="text-2xl font-bold text-purple-600">
            {oportunidades.length}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Impacto Total</p>
          <h2 className="text-2xl font-bold text-green-600">
            R$ {calcularImpacto(decisionsOrdenadas).toLocaleString()}
          </h2>
        </div>
      </div>

      {/* GRÁFICO */}
      <ImpactChart data={chartData} />

      {/* STATUS */}
      <div className="bg-white p-5 rounded-xl border shadow-sm">
        <p className="text-sm text-gray-500">
          STATUS DO SISTEMA
        </p>

        <div className="flex justify-between items-center mt-2">
          <h2 className="text-xl font-bold">
            {criticos.length > 0 ? "🔥 CRÍTICO" : "🟢 ESTÁVEL"}
          </h2>

          <span>{criticos.length} críticos</span>
        </div>
      </div>

      {/* DESTAQUE */}
      {decisionsOrdenadas[0] && (
        <div className="bg-purple-50 border border-purple-200 p-5 rounded-xl">
          <p className="text-sm text-purple-600">
            DECISÃO PRIORITÁRIA
          </p>

          <h2 className="text-xl font-bold">
            {decisionsOrdenadas[0].titulo}
          </h2>

          <p className="text-gray-600">
            {decisionsOrdenadas[0].descricao}
          </p>
        </div>
      )}

      {loading && <p>Carregando...</p>}

      {/* PROBLEMAS */}
      <div>
        <h2 className="text-lg font-bold mb-3">
          🚨 Problemas
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {problemas.map((d) => (
            <DecisionCard
              key={d.id}
              d={d}
              onApply={applyDecision}
              onIgnore={ignoreDecision}
            />
          ))}
        </div>
      </div>

      {/* OPORTUNIDADES */}
      <div>
        <h2 className="text-lg font-bold mb-3">
          💡 Oportunidades
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {oportunidades.map((d) => (
            <DecisionCard
              key={d.id}
              d={d}
              onApply={applyDecision}
              onIgnore={ignoreDecision}
            />
          ))}
        </div>
      </div>
    </div>
  );
}