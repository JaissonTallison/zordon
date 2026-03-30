import useDecisionStore from "../store/useDecisionStore";
export default function Relatorios() {
  const { decisions } = useDecisionStore();

  // KPIs
  const totalImpacto = decisions.reduce(
    (acc, d) => acc + Number(d.impacto_valor || 0),
    0
  );

  const problemas = decisions.filter(d => d.tipo === "problema");
  const oportunidades = decisions.filter(d => d.tipo === "oportunidade");

  const aplicadas = decisions.filter(d => d.status_execucao === "aplicado");
  const ignoradas = decisions.filter(d => d.status_execucao === "ignorado");

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <p className="text-textSecondary">
          Análise de impacto das decisões geradas pelo sistema
        </p>
      </div>

      {/* KPIs */}
      <div className="grid md:grid-cols-4 gap-4">

        <Card title="Impacto Total" value={`R$ ${totalImpacto.toLocaleString()}`} color="green" />

        <Card title="Problemas" value={problemas.length} color="red" />

        <Card title="Oportunidades" value={oportunidades.length} color="purple" />

        <Card title="Aderência" value={`${aplicadas.length} aplicadas`} color="blue" />

      </div>

      {/* ANÁLISE */}
      <div className="bg-white p-6 rounded-xl shadow border space-y-3">

        <h2 className="text-lg font-semibold">
          Performance das decisões
        </h2>

        <p className="text-sm text-gray-600">
          {aplicadas.length} decisões aplicadas vs {ignoradas.length} ignoradas
        </p>

        <div className="w-full bg-gray-200 h-3 rounded-full">
          <div
            className="bg-green-500 h-3 rounded-full"
            style={{
              width: `${(aplicadas.length / (decisions.length || 1)) * 100}%`
            }}
          />
        </div>

      </div>

    </div>
  );
}

/**
 * CARD KPI
 */
function Card({ title, value, color }) {
  const cores = {
    green: "text-green-600",
    red: "text-red-500",
    purple: "text-purple-600",
    blue: "text-blue-600"
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow border">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold ${cores[color]}`}>
        {value}
      </h2>
    </div>
  );
}