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

      const lista = Array.isArray(res.data) ? res.data : [];

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

      {/*  HEADER (MANTÉM GRADIENTE) */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold">
           Centro de decisão
        </h1>
        <p className="text-sm opacity-80">
          Visão geral da operação baseada nos dados atuais
        </p>
      </div>

      {/* SEM DADOS */}
      {!principal && (
        <div className="text-textSecondary">
          Nenhuma decisão encontrada
        </div>
      )}

      {/*  DECISÃO PRINCIPAL (SUAVE) */}
      {principal && (
        <div className="bg-purple-100 border border-purple-200 p-6 rounded-2xl shadow-sm space-y-5">

          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-textPrimary">
                {principal.produto_nome || principal.titulo}
              </h2>

              <p className="text-sm text-textSecondary">
                {principal.titulo_amigavel || principal.tipo}
              </p>
            </div>

            <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-orange-600">
              {principal.tipo}
            </span>
          </div>

          <p className="text-sm text-textSecondary">
            {principal.descricao}
          </p>

          <div className="bg-white p-4 rounded-xl border">
            <p className="text-xs text-textSecondary">Impacto</p>
            <p className="text-lg font-semibold text-orange-600">
              R$ {Number(principal.impacto_valor || 0).toLocaleString("pt-BR")}
            </p>
          </div>

          {principal.recomendacao?.acao && (
            <div className="bg-orange-100/60 p-4 rounded-xl text-sm text-orange-700">
               {principal.recomendacao.acao}
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
      <h3 className="text-md font-semibold mb-3 text-textPrimary">{title}</h3>

      <div className="space-y-3">
        {items.map((d, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between">

              <div>
                <p className="font-medium text-textPrimary">
                  {d.produto_nome || d.titulo}
                </p>

                <p className="text-sm text-textSecondary">
                  {d.descricao}
                </p>
              </div>

              <p className="text-orange-600 font-medium">
                R$ {Number(d.impacto_valor || 0).toLocaleString("pt-BR")}
              </p>

            </div>

            <div className="flex gap-3 mt-2 text-sm">

              <button
                onClick={() => atualizar(d.id, "RESOLVIDO")}
                className="text-green-600 hover:underline"
              >
                Resolver
              </button>

              <button
                onClick={() => atualizar(d.id, "IGNORADO")}
                className="text-red-500 hover:underline"
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