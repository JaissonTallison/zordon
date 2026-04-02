import { useEffect, useState } from "react";
import api from "../services/api";

export default function Decisions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await api.get("/engine/decisions");
      setData(res.data || null);
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

      setData((prev) => {
        if (!prev) return prev;

        const updateList = (list) =>
          list.map((d) =>
            d.id === id ? { ...d, status } : d
          );

        return {
          ...prev,
          decisoes: {
            problemas: updateList(prev.decisoes.problemas),
            oportunidades: updateList(prev.decisoes.oportunidades),
            alertas: updateList(prev.decisoes.alertas)
          }
        };
      });

    } catch (err) {
      console.error(err);
      load();
    }
  }

  function renderCard(d) {
    return (
      <div
        key={d.id}
        className="bg-white p-5 rounded-2xl border shadow-sm space-y-3 hover:shadow-md transition"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-textPrimary">
              {d.produto_nome || d.codigo}
            </p>

            <p className="text-xs text-textSecondary">
              {d.titulo_amigavel || d.codigo}
            </p>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-600">
            {d.prioridade}
          </span>
        </div>

        <p className="text-sm text-textSecondary">
          {d.descricao}
        </p>

        <div className="bg-gray-50 p-3 rounded-xl">
          <p className="text-xs text-textSecondary">
            Impacto
          </p>

          <p className="font-bold text-orange-600">
            R$ {Number(d.impacto_valor || 0).toLocaleString("pt-BR")}
          </p>
        </div>

        {d.mensagem_recorrencia && (
          <div className="text-xs text-red-500">
            {d.mensagem_recorrencia}
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {d.status || "PENDENTE"}
          </span>

          <div className="flex gap-3">
            <button
              onClick={() => atualizarStatus(d.id, "RESOLVIDO")}
              className="text-green-600 text-xs hover:underline"
            >
              Resolver
            </button>

            <button
              onClick={() => atualizarStatus(d.id, "IGNORADO")}
              className="text-red-500 text-xs hover:underline"
            >
              Ignorar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="text-textSecondary">Carregando decisões...</div>;
  }

  if (!data) {
    return <div className="text-textSecondary">Sem dados</div>;
  }

  const { resumo, decisoes } = data;

  //  TOP 3 MAIS IMPORTANTES
  const top3 = [
    ...decisoes.problemas,
    ...decisoes.oportunidades,
    ...decisoes.alertas
  ]
    .sort((a, b) => b.impacto_valor - a.impacto_valor)
    .slice(0, 3);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">
           Decisões Inteligentes
        </h1>
        <p className="text-textSecondary">
          Prioridade baseada em impacto e contexto do negócio
        </p>
      </div>

      {/* TOP 3 PRIORIDADE (DESTAQUE) */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-2xl shadow-lg">

        <p className="text-sm opacity-80">
           Ações prioritárias agora
        </p>

        <div className="mt-4 space-y-3">

          {top3.map((d, i) => (
            <div key={d.id} className="flex justify-between items-center">

              <div>
                <p className="font-semibold">
                  #{i + 1} {d.produto_nome}
                </p>

                <p className="text-xs opacity-80">
                  {d.titulo_amigavel}
                </p>
              </div>

              <p className="font-bold">
                R$ {Number(d.impacto_valor).toLocaleString("pt-BR")}
              </p>

            </div>
          ))}

        </div>

      </div>

      {/* RESUMO */}
      <div className="grid grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-xs text-gray-500">Impacto total</p>
          <p className="font-bold text-orange-600">
            R$ {Number(resumo.impacto_total || 0).toLocaleString("pt-BR")}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-xs text-gray-500">Problemas</p>
          <p className="font-bold">{resumo.problemas}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-xs text-gray-500">Oportunidades</p>
          <p className="font-bold">{resumo.oportunidades}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-xs text-gray-500">Alertas</p>
          <p className="font-bold">{resumo.alertas}</p>
        </div>

      </div>

      {/* PROBLEMAS */}
      <div>
        <h2 className="font-semibold mb-3 text-red-500">
          Problemas
        </h2>
        <div className="space-y-3">
          {decisoes.problemas.map(renderCard)}
        </div>
      </div>

      {/* OPORTUNIDADES */}
      <div>
        <h2 className="font-semibold mb-3 text-green-600">
          Oportunidades
        </h2>
        <div className="space-y-3">
          {decisoes.oportunidades.map(renderCard)}
        </div>
      </div>

      {/* ALERTAS */}
      <div>
        <h2 className="font-semibold mb-3 text-yellow-600">
          Alertas
        </h2>
        <div className="space-y-3">
          {decisoes.alertas.map(renderCard)}
        </div>
      </div>

    </div>
  );
}