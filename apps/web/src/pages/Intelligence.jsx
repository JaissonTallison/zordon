import { useEffect, useState } from "react";
import api from "../services/api";

export default function Intelligence() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await api.post("/engine/executar");

      console.log("INTELLIGENCE DATA:", res.data); // 🔥 DEBUG

      setData(res.data);
    } catch (err) {
      console.error("Erro ao carregar intelligence:", err);
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

  const tendencias = data?.tendencias || [];
  const previsoes = data?.previsoes || [];
  const cenarios = data?.cenarios || [];
  const decisions = data?.decisions || [];

  const lista = [...tendencias, ...previsoes, ...cenarios];

  // 🔥 PRIORIDADE DO CARD PRINCIPAL
  const principal =
    previsoes[0] ||
    tendencias[0] ||
    cenarios[0] ||
    decisions[0] ||
    null;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-textPrimary">
          Inteligência
        </h1>
        <p className="text-textSecondary">
          Análise baseada no comportamento do sistema
        </p>
      </div>

      {/* 🔥 CARD PRINCIPAL (PADRÃO HOME) */}
      {principal && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">

          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-textSecondary">
              Insight mais importante agora
            </p>

            <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-600">
              IA
            </span>
          </div>

          <h2 className="text-xl font-semibold text-textPrimary">
            {principal.titulo || principal.codigo || "Análise"}
          </h2>

          <p className="text-textSecondary">
            {principal.descricao || "Insight gerado pelo sistema"}
          </p>

          {/* IMPACTO */}
          <div className="bg-gray-100 p-4 rounded-xl mt-4">
            <p className="text-sm text-textSecondary">
              Impacto estimado
            </p>

            <p className="text-orange-500 font-semibold">
              R$ {Number(principal.impacto_valor || principal.impacto || 0)
                .toLocaleString("pt-BR")}
            </p>
          </div>

          {/* AÇÃO */}
          <div className="bg-gray-100 p-4 rounded-xl mt-3">
            <p className="text-sm text-textSecondary">
              Ação recomendada
            </p>

            <p className="text-sm text-textPrimary">
              {principal.recomendacao?.acao ||
                principal.recomendacao ||
                "Aguardar mais dados"}
            </p>
          </div>

          {/* BOTÕES */}
          <div className="flex items-center gap-4 mt-4">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">
              Executar ação
            </button>

            <span className="text-green-600 text-sm cursor-pointer">
              Aplicar
            </span>

            <span className="text-red-500 text-sm cursor-pointer">
              Ignorar
            </span>
          </div>

        </div>
      )}

      {/* 🔥 LISTA (PADRÃO PROBLEMAS) */}
      <div className="space-y-4">

        <h2 className="font-semibold text-textPrimary">
          Insights gerados
        </h2>

        {/* 🚨 FALLBACK INTELIGENTE */}
        {lista.length === 0 ? (
          decisions.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
              <p className="text-textSecondary">
                Ainda não há dados suficientes
              </p>

              <p className="text-sm text-gray-400 mt-1">
                O Zordon precisa de mais movimentação para gerar inteligência
              </p>
            </div>
          ) : (
            decisions.map((d) => (
              <div
                key={d.id}
                className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between"
              >
                <div>
                  <p className="font-medium text-textPrimary">
                    {d.codigo}
                  </p>

                  <p className="text-sm text-textSecondary">
                    Produto ID: {d.produto_id}
                  </p>

                  <div className="mt-2">
                    <span className="text-green-600 text-sm mr-2 cursor-pointer">
                      Aplicar
                    </span>
                    <span className="text-red-500 text-sm cursor-pointer">
                      Ignorar
                    </span>
                  </div>
                </div>

                <div className="text-orange-500 font-semibold">
                  R$ {Number(d.impacto_valor || 0).toLocaleString("pt-BR")}
                </div>
              </div>
            ))
          )
        ) : (
          lista.map((item, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between"
            >
              <div>
                <p className="font-medium text-textPrimary">
                  {item.titulo || "Insight"}
                </p>

                <p className="text-sm text-textSecondary">
                  {item.descricao}
                </p>

                <div className="mt-2">
                  <span className="text-green-600 text-sm mr-2 cursor-pointer">
                    Aplicar
                  </span>
                  <span className="text-red-500 text-sm cursor-pointer">
                    Ignorar
                  </span>
                </div>
              </div>

              <div className="text-orange-500 font-semibold">
                R$ {Number(item.impacto || 0).toLocaleString("pt-BR")}
              </div>
            </div>
          ))
        )}

      </div>

    </div>
  );
}