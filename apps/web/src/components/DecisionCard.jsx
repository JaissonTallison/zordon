export default function DecisionCard({ d }) {
  const isCritico = d.nivel === "CRITICO";

  const getStyle = () => {
    if (d.nivel === "CRITICO") {
      return "border-red-500 bg-red-50 animate-pulse";
    }
    if (d.nivel === "ALTO") {
      return "border-yellow-500 bg-yellow-50";
    }
    if (d.nivel === "MEDIO") {
      return "border-blue-500 bg-blue-50";
    }
    return "border-gray-200 bg-white";
  };

  return (
    <div
      className={`p-5 rounded-xl border-l-4 ${getStyle()} shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{d.titulo}</h2>

        <span
          className={`text-xs px-2 py-1 rounded ${
            isCritico ? "bg-red-600 text-white" : "bg-gray-800 text-white"
          }`}
        >
          {d.nivel}
        </span>
      </div>

      <p className="text-sm text-gray-600 mt-2">
        {d.descricao}
      </p>

      <div className="mt-3 text-sm space-y-1">
        <p>💰 {d.impacto}</p>
        <p>⏱ {d.recorrencia} dias</p>
      </div>

      {d.acao_recomendada && (
        <div className="mt-4 p-3 rounded-lg bg-purple-100">
          <p className="text-xs text-gray-500">
            AÇÃO RECOMENDADA
          </p>
          <p className="text-sm font-semibold text-purple-700">
            {d.acao_recomendada}
          </p>
        </div>
      )}
    </div>
  );
}