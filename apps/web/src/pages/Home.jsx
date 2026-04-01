import { useEffect, useState, useRef } from "react";
import api from "../services/api";

export default function Home() {
  const [data, setData] = useState({
    problemas: [],
    alertas: [],
    oportunidades: [],
    previsoes: []
  });

  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);

  async function load() {
    try {
      const res = await api.post("/engine/executar");

      console.log("🔥 ENGINE RESPONSE:", res.data);

      // BACKEND AGORA RETORNA ARRAY
      const lista = Array.isArray(res.data) ? res.data : [];

      // AGRUPAMENTO NO FRONT
      const agrupado = {
        problemas: lista.filter(d => d.tipo === "problema"),
        alertas: lista.filter(d => d.tipo === "alerta"),
        oportunidades: lista.filter(d => d.tipo === "oportunidade"),
        previsoes: lista.filter(d => d.tipo === "previsao")
      };

      setData(agrupado);

    } catch (err) {
      console.error(err);

      setData({
        problemas: [],
        alertas: [],
        oportunidades: [],
        previsoes: []
      });

    } finally {
      setLoading(false);
    }
  }

  async function atualizar(id, status) {
    try {
      await api.patch(`/engine/status/${id}`, { status });
      load();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    load();
  }, []);

  if (loading) {
    return <div className="text-textSecondary">Carregando...</div>;
  }

  const principal =
    data.problemas[0] ||
    data.alertas[0] ||
    data.oportunidades[0] ||
    data.previsoes[0] ||
    null;

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h1 className="text-xl font-semibold text-textPrimary">
          Centro de Decisão
        </h1>
        <p className="text-textSecondary">
          Análise baseada em dados reais da operação
        </p>
      </div>

      {/*SE NÃO TEM NADA */}
      {!principal && (
        <div className="text-textSecondary">
          Nenhuma decisão encontrada
        </div>
      )}

      {/* DECISÃO PRINCIPAL */}
      {principal && (
        <div className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">

          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                {principal.titulo}
              </h2>
            </div>

            <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-600">
              {principal.tipo}
            </span>
          </div>

          <p>{principal.descricao}</p>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm">Impacto</p>
            <p className="text-xl font-bold text-orange-600">
              R$ {principal.impacto_valor || 0}
            </p>
          </div>

          {principal.recomendacao?.acao && (
            <div className="bg-purple-50 p-4 rounded-xl">
              👉 {principal.recomendacao.acao}
            </div>
          )}

        </div>
      )}

      <Section title="Problemas" items={data.problemas} atualizar={atualizar} />
      <Section title="Alertas" items={data.alertas} atualizar={atualizar} />
      <Section title="Oportunidades" items={data.oportunidades} atualizar={atualizar} />
      <Section title="Previsões" items={data.previsoes} atualizar={atualizar} />

    </div>
  );
}

/**
 * SECTION
 */
function Section({ title, items, atualizar }) {
  if (!items.length) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>

      <div className="space-y-3">
        {items.map((d, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl border"
          >
            <div className="flex justify-between">

              <div>
                <p className="font-semibold">{d.titulo}</p>
                <p className="text-sm text-gray-500">
                  {d.descricao}
                </p>
              </div>

              <p className="text-orange-600 font-bold">
                R$ {d.impacto_valor || 0}
              </p>

            </div>

            <div className="flex gap-3 mt-2 text-sm">

              <button
                onClick={() => atualizar(d.id, "RESOLVIDO")}
                className="text-green-600"
              >
                Resolver
              </button>

              <button
                onClick={() => atualizar(d.id, "IGNORADO")}
                className="text-red-500"
              >
                Ignorar
              </button>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}