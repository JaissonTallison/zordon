import { useEffect, useState } from "react";
import api from "../services/api";

export default function Decisions() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await api.get("/engine/resultados");
      setDados(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function atualizarStatus(id, status) {
    try {
      await api.patch(`/engine/status/${id}`, { status });
      load();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return <div className="text-gray-500">Carregando decisões...</div>;
  }

  if (!dados.length) {
    return (
      <div className="text-gray-400">
        Nenhuma decisão encontrada
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-textPrimary">
          Ações Inteligentes
        </h1>
        <p className="text-textSecondary">
          Decisões geradas automaticamente pelo sistema
        </p>
      </div>

      {/* LISTA */}
      {dados.map((d) => (
        <div
          key={d.id}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4"
        >

          {/* TOPO */}
          <div className="flex justify-between items-start">

            <div>
              <p className="text-lg font-semibold text-textPrimary">
                {d.codigo}
              </p>

              <p className="text-sm text-textSecondary">
                Produto ID: {d.produto_id}
              </p>
            </div>

            <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-600">
              {d.prioridade}
            </span>

          </div>

          {/* DESCRIÇÃO */}
          <p className="text-textSecondary text-sm">
            {d.descricao}
          </p>

          {/* IMPACTO */}
          <div className="bg-gray-50 p-4 rounded-xl">

            <p className="text-xs text-textSecondary">
              Impacto estimado
            </p>

            <p className="text-xl font-bold text-orange-600">
              R$ {Number(d.impacto_valor || 0).toLocaleString("pt-BR")}
            </p>

          </div>

          {/* RECORRÊNCIA (SE EXISTIR) */}
          {d.mensagem_recorrencia && (
            <div className="text-xs text-red-500">
              ⚠️ {d.mensagem_recorrencia}
            </div>
          )}

          {/* STATUS */}
          <div className="text-xs text-textSecondary">
            Status: {d.status || "PENDENTE"}
          </div>

          {/* AÇÃO */}
          <div className="flex gap-4 items-center">

            <button
              onClick={() => atualizarStatus(d.id, "RESOLVIDO")}
              className="text-green-600 text-sm"
            >
              Resolver
            </button>

            <button
              onClick={() => atualizarStatus(d.id, "IGNORADO")}
              className="text-red-500 text-sm"
            >
              Ignorar
            </button>

          </div>

        </div>
      ))}

    </div>
  );
}