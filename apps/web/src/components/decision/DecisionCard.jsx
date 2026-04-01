export default function DecisionCard({ d, onApply, onIgnore }) {
  const isCritico = d.prioridade === "CRITICO";

  const getStyle = () => {
    if (d.prioridade === "CRITICO") {
      return "border-red-500 bg-red-50 animate-pulse";
    }
    if (d.prioridade === "ALTO") {
      return "border-yellow-500 bg-yellow-50";
    }
    if (d.prioridade === "MEDIO") {
      return "border-blue-500 bg-blue-50";
    }
    return "border-gray-200 bg-white";
  };

  return (
    <div
      className={`p-5 rounded-xl border-l-4 ${getStyle()} shadow-sm hover:shadow-md transition-all duration-300`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{d.titulo}</h2>

        <span
          className={`text-xs px-2 py-1 rounded ${
            isCritico ? "bg-red-600 text-white" : "bg-gray-800 text-white"
          }`}
        >
          {d.prioridade}
        </span>
      </div>

      {/* DESCRIÇÃO */}
      <p className="text-sm text-gray-600 mt-2">
        {d.descricao}
      </p>

      {/* MÉTRICAS */}
      <div className="mt-3 text-sm space-y-1">
        <p>💰 {d.impacto}</p>
        <p>📊 R$ {Number(d.impacto_valor || 0).toFixed(2)}</p>

        {d.confianca !== undefined && (
          <p className="text-xs text-gray-500">
            🔍 Confiança: {(d.confianca * 100).toFixed(0)}%
          </p>
        )}
      </div>

      {/* AÇÃO RECOMENDADA */}
      {d.recomendacao && (
        <div className="mt-4 p-3 rounded-lg bg-purple-100">
          <p className="text-xs text-gray-500">
            AÇÃO RECOMENDADA
          </p>
          <p className="text-sm font-semibold text-purple-700">
            {typeof d.recomendacao === "string"
              ? d.recomendacao
              : d.recomendacao?.acao}
          </p>
        </div>
      )}

      {/* EXPLICAÇÃO */}
      {d.explicacao?.logica && (
        <div className="mt-3 text-xs text-gray-400">
          Baseado em: {d.explicacao.logica}
        </div>
      )}

      {/* AÇÕES */}
      {d.status_execucao === "pendente" && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onApply(d.id)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            Aplicar
          </button>

          <button
            onClick={() => onIgnore(d.id)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
          >
            Ignorar
          </button>
        </div>
      )}

      {/* STATUS */}
      {d.status_execucao !== "pendente" && (
        <div className="mt-4 text-xs text-gray-500">
          Status: {d.status_execucao}
        </div>
      )}
    </div>
  );
}