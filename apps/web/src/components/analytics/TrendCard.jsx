import { useEffect, useState, useRef } from "react";
import api from "../../services/api";

export default function Dashboard() {
  const [decisions, setDecisions] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  const hasLoaded = useRef(false);

  async function load() {
    try {
      const [decRes, prodRes] = await Promise.all([
        api.post("/engine/executar"),
        api.get("/produtos")
      ]);

      const sorted = decRes.data.sort(
        (a, b) => (b.impacto_valor || 0) - (a.impacto_valor || 0)
      );

      setDecisions(sorted);
      setProdutos(prodRes.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    load();
  }, []);

  if (loading) {
    return <div className="p-6 text-white">Carregando...</div>;
  }

  const principal = decisions[0];
  const impactoTotal = decisions.reduce((a, d) => a + (d.impacto_valor || 0), 0);

  return (
    <div className="p-6 bg-zordon-dark min-h-screen text-white space-y-8">

      {/* STATUS GERAL */}
      <div className="grid grid-cols-4 gap-4">

        <div className="bg-zordon-mid p-4 rounded-xl">
          <p className="text-xs text-white/50">Produtos</p>
          <p className="text-xl font-bold">{produtos.length}</p>
        </div>

        <div className="bg-zordon-mid p-4 rounded-xl">
          <p className="text-xs text-white/50">Decisões</p>
          <p className="text-xl font-bold">{decisions.length}</p>
        </div>

        <div className="bg-zordon-mid p-4 rounded-xl">
          <p className="text-xs text-white/50">Impacto</p>
          <p className="text-xl font-bold text-orange-400">
            R$ {impactoTotal}
          </p>
        </div>

        <div className="bg-zordon-mid p-4 rounded-xl">
          <p className="text-xs text-white/50">Risco</p>
          <p className="text-xl font-bold text-red-400">
            {principal?.nivel}
          </p>
        </div>

      </div>

      {/* DECISÃO PRINCIPAL */}
      {principal && (
        <div className="bg-zordon-mid p-6 rounded-xl border border-red-500/20">

          <h2 className="text-red-400 text-sm font-semibold">
            AÇÃO URGENTE
          </h2>

          <h3 className="text-2xl font-bold mt-2">
            {principal.titulo}
          </h3>

          <p className="text-white/70 mt-2">
            {principal.descricao}
          </p>

          <div className="mt-4 text-orange-400 font-bold">
            R$ {principal.impacto_valor}
          </div>

          <div className="mt-4 bg-black/30 p-4 rounded-xl">
            👉 {principal.recomendacao?.acao}
          </div>

        </div>
      )}

      {/* LISTA DE DECISÕES (AÇÃO REAL) */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Decisões disponíveis
        </h2>

        <div className="space-y-3">
          {decisions.map((d, i) => (
            <div
              key={i}
              className="bg-zordon-mid p-4 rounded-xl flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{d.titulo}</p>
                <p className="text-xs text-white/60">
                  {d.descricao}
                </p>
              </div>

              <div className="text-right">
                <p className="text-orange-400 font-bold">
                  R$ {d.impacto_valor}
                </p>
                <p className="text-xs text-red-400">
                  {d.nivel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VISÃO OPERACIONAL */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Produtos
        </h2>

        <div className="grid grid-cols-3 gap-3">
          {produtos.map((p) => (
            <div
              key={p.id}
              className="bg-zordon-mid p-3 rounded-xl"
            >
              <p className="font-semibold">{p.nome}</p>
              <p className="text-xs text-white/60">
                Estoque: {p.estoque}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}