import { useEffect, useState } from "react";
import api from "../services/api";

export default function Products() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/produtos");
        console.log("PRODUTOS:", res.data);
        setProdutos(res.data || []);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // 🔥 MÉTRICAS
  const total = produtos.length;

  const estoqueTotal = produtos.reduce(
    (acc, p) => acc + Number(p.estoque || 0),
    0
  );

  const criticos = produtos.filter(
    (p) => p.estoque <= (p.minimo || 0)
  );

  const principal = criticos[0] || produtos[0];

  if (loading) {
    return (
      <div className="text-textSecondary">
        Carregando produtos...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-textPrimary">
          Produtos
        </h1>
        <p className="text-textSecondary">
          Base operacional do sistema
        </p>
      </div>

      {/* RESUMO */}
      <div className="grid grid-cols-3 gap-4">

        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-sm text-textSecondary">
            Total de produtos
          </p>
          <p className="text-xl font-semibold text-textPrimary">
            {total}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-sm text-textSecondary">
            Estoque total
          </p>
          <p className="text-xl font-semibold text-textPrimary">
            {estoqueTotal}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-sm text-textSecondary">
            Produtos críticos
          </p>
          <p className="text-xl font-semibold text-red-500">
            {criticos.length}
          </p>
        </div>

      </div>

      {/* CARD PRINCIPAL */}
      {principal && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">

          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-textSecondary">
              Produto mais crítico
            </p>

            {principal.estoque <= principal.minimo && (
              <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-600">
                CRÍTICO
              </span>
            )}
          </div>

          <h2 className="text-xl font-semibold text-textPrimary">
            {principal.nome}
          </h2>

          <p className="text-textSecondary">
            Estoque atual: {principal.estoque}
          </p>

          {/* SITUAÇÃO */}
          <div className="bg-gray-100 p-4 rounded-xl mt-4">
            <p className="text-sm text-textSecondary">
              Situação
            </p>

            <p className="text-orange-500 font-semibold">
              {principal.estoque <= principal.minimo
                ? "Estoque baixo"
                : "Normal"}
            </p>
          </div>

          {/* AÇÃO */}
          <div className="bg-gray-100 p-4 rounded-xl mt-3">
            <p className="text-sm text-textSecondary">
              Ação recomendada
            </p>

            <p className="text-sm text-textPrimary">
              {principal.estoque <= principal.minimo
                ? "Repor estoque imediatamente"
                : "Monitorar vendas"}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">
              Ajustar estoque
            </button>
          </div>

        </div>
      )}

      {/* LISTA */}
      <div className="space-y-4">

        <h2 className="font-semibold text-textPrimary">
          Lista de produtos
        </h2>

        {produtos.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
            <p className="text-textSecondary">
              Nenhum produto cadastrado
            </p>
          </div>
        ) : (
          produtos.map((p) => (
            <div
              key={p.id}
              className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between"
            >
              <div>
                <p className="font-medium text-textPrimary">
                  {p.nome}
                </p>

                <p className="text-sm text-textSecondary">
                  Estoque: {p.estoque}
                </p>

                <div className="text-xs text-textSecondary mt-1">
                  Mínimo: {p.minimo}
                </div>
              </div>

              <div
                className={`font-semibold ${
                  p.estoque <= p.minimo
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                {p.estoque <= p.minimo ? "Crítico" : "OK"}
              </div>
            </div>
          ))
        )}

      </div>

    </div>
  );
}