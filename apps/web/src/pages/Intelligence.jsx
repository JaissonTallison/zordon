import { useEffect, useState } from "react";
import api from "../services/api";

export default function Intelligence() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await api.get("/engine/intelligence");

      console.log("INTELLIGENCE:", res.data);

      setData(res.data);
    } catch (err) {
      console.error("Erro ao carregar inteligência:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="text-textSecondary">
        Carregando inteligência...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-textSecondary">
        Nenhum dado disponível
      </div>
    );
  }

  const { resumo, insights, top, recomendacao_principal } = data;

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">
          Inteligência
        </h1>
        <p className="text-textSecondary">
          Análise estratégica do sistema
        </p>
      </div>

      {/* RESUMO */}
      <div className="grid grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-xs text-gray-500">Impacto total</p>
          <p className="text-xl font-bold text-orange-500">
            R$ {Number(resumo?.impacto_total || 0).toLocaleString("pt-BR")}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-xs text-gray-500">Problemas</p>
          <p className="text-xl font-bold">
            {resumo?.problemas || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-xs text-gray-500">Oportunidades</p>
          <p className="text-xl font-bold">
            {resumo?.oportunidades || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-xs text-gray-500">Alertas</p>
          <p className="text-xl font-bold">
            {resumo?.alertas || 0}
          </p>
        </div>

      </div>

      {/* RECOMENDAÇÃO PRINCIPAL */}
      {recomendacao_principal && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg">

          <p className="text-sm opacity-80">
            Principal recomendação
          </p>

          <h2 className="text-xl font-bold mt-2">
            {recomendacao_principal.titulo || recomendacao_principal.codigo}
          </h2>

          <p className="opacity-80 mt-1">
            {recomendacao_principal.descricao}
          </p>

          <div className="mt-4 text-lg font-semibold">
            R$ {Number(recomendacao_principal.impacto_valor || 0)
              .toLocaleString("pt-BR")}
          </div>

        </div>
      )}

      {/* TOP DECISÕES */}
      <div>
        <h2 className="font-semibold mb-3 text-textPrimary">
          Top decisões
        </h2>

        <div className="space-y-3">

          {top?.map((d, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl border flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
                  #{i + 1} {d.titulo || d.codigo}
                </p>
                <p className="text-xs text-gray-500">
                  {d.descricao}
                </p>
              </div>

              <div className="text-orange-500 font-bold">
                R$ {Number(d.impacto_valor || 0).toLocaleString("pt-BR")}
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* INSIGHTS */}
      <div>
        <h2 className="font-semibold mb-3 text-textPrimary">
          Insights
        </h2>

        <div className="space-y-3">

          {[...(insights?.previsoes || []),
            ...(insights?.tendencias || []),
            ...(insights?.cenarios || [])].map((item, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl border"
            >
              <p className="font-semibold">
                {item.titulo || item.tipo}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {item.descricao}
              </p>

              {item.impacto && (
                <div className="mt-3 text-orange-500 font-bold">
                  R$ {Number(item.impacto).toLocaleString("pt-BR")}
                </div>
              )}

              {item.confianca && (
                <p className="text-xs text-gray-400 mt-1">
                  Confiança: {Math.round(item.confianca * 100)}%
                </p>
              )}

            </div>
          ))}

        </div>
      </div>

    </div>
  );
}