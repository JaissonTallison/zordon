import { useEffect, useState } from "react";
import api from "../services/api";

export default function Impact() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/engine/resultados");

        const normalizado = (res.data || []).map((d) => ({
          ...d,
          impacto_valor: Number(d.impacto_valor || 0),
          score: Number(d.score || 0)
        }));

        setData(normalizado);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <div className="text-textSecondary">Carregando impacto...</div>;
  }

  // KPIs
  const total = data.reduce((acc, d) => acc + d.impacto_valor, 0);

  const perdas = data
    .filter((d) =>
      d.codigo?.includes("PARADO") ||
      d.codigo?.includes("SEM_VENDAS") ||
      d.codigo?.includes("ESTOQUE_BAIXO")
    )
    .reduce((acc, d) => acc + d.impacto_valor, 0);

  const ganhos = data
    .filter((d) =>
      d.codigo?.includes("ALTA_DEMANDA")
    )
    .reduce((acc, d) => acc + d.impacto_valor, 0);

  // principal
  const principal =
    [...data].sort((a, b) => b.impacto_valor - a.impacto_valor)[0] || null;

  // top 5
  const top = [...data]
    .sort((a, b) => b.impacto_valor - a.impacto_valor)
    .slice(0, 5);

  // helper (NÃO muda design, só conteúdo)
  function getTitulo(d) {
    return d.produto_nome
      ? `${d.produto_nome}`
      : d.codigo.replaceAll("_", " ");
  }

  function getDescricao(d) {
    if (d.produto_nome) {
      return `Impacto relacionado a ${d.produto_nome}`;
    }
    
    return d.produto_nome
      ? `${d.produto_nome} está impactando seu resultado`
      : `Relacionado a ${d.codigo.replaceAll("_", " ")}`;
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">
           Impacto Financeiro
        </h1>
        <p className="text-textSecondary">
          Onde você está perdendo e ganhando dinheiro agora
        </p>
      </div>

      {/* KPI */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-2xl shadow-lg">

        <p className="text-sm opacity-80">Impacto total identificado</p>

        <h2 className="text-4xl font-bold mt-2">
          R$ {total.toLocaleString("pt-BR")}
        </h2>

        <div className="flex gap-6 mt-4 text-sm">

          <div>
            <p className="opacity-80">Perdas</p>
            <p className="font-semibold">
              R$ {perdas.toLocaleString("pt-BR")}
            </p>
          </div>

          <div>
            <p className="opacity-80">Ganhos</p>
            <p className="font-semibold">
              R$ {ganhos.toLocaleString("pt-BR")}
            </p>
          </div>

        </div>

      </div>

      {/* PRINCIPAL */}
      {principal && (
        <div className="bg-white p-6 rounded-2xl border shadow-sm">

          <p className="text-sm text-gray-500">
            Maior impacto agora
          </p>

          <h2 className="text-xl font-semibold mt-1">
            {getTitulo(principal)}
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            {getDescricao(principal)}
          </p>

          <div className="mt-4 text-2xl font-bold text-orange-500">
            R$ {principal.impacto_valor.toLocaleString("pt-BR")}
          </div>

        </div>
      )}

      {/* TOP */}
      <div>
        <h2 className="font-semibold mb-3 text-textPrimary">
          Top impactos
        </h2>

        <div className="space-y-3">

          {top.map((d, i) => (
            <div
              key={d.id}
              className="bg-white p-4 rounded-xl border flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
                  #{i + 1} {getTitulo(d)}
                </p>

                <p className="text-xs text-gray-500">
                  {getDescricao(d)}
                </p>
              </div>

              <div className="text-orange-500 font-bold">
                R$ {d.impacto_valor.toLocaleString("pt-BR")}
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* LISTA */}
      <div>
        <h2 className="font-semibold mb-3 text-textPrimary">
          Todos os impactos
        </h2>

        <div className="space-y-2">

          {data.map((d) => (
            <div
              key={d.id}
              className="flex justify-between text-sm border-b pb-2"
            >
              <span className="text-gray-600">
                {d.produto_nome || d.codigo}
              </span>

              <span className="text-orange-500 font-medium">
                R$ {d.impacto_valor.toLocaleString("pt-BR")}
              </span>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}