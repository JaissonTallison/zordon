"use client";

import { useEffect, useState } from "react";



import {
  DollarSign,
  BarChart3,
  ShoppingCart,
  AlertTriangle
} from "lucide-react";
import { Insight, Produto, Venda } from "@/src/lib/types";
import { getProdutos } from "@/src/lib/services/product.service";
import { getVendas } from "@/src/lib/services/sales.service";
import { getInsights } from "@/src/lib/services/insights.service";
import { Sidebar } from "@/src/components/layout/sidebar";
import { Header } from "@/src/components/layout/header";
import { MetricCard } from "@/src/components/features/dashboard/components/metric-card";
import { SalesChart } from "@/src/components/features/dashboard/components/sales-chart";
import { InsightsCard } from "@/src/components/features/dashboard/components/insights-card";
import { StockAlert } from "@/src/components/features/dashboard/components/stock-alert";

export default function DashboardPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [produtosData, vendasData, insightsData] =
          await Promise.all([
            getProdutos(),
            getVendas(),
            getInsights(),
          ]);

        setProdutos(produtosData);
        setVendas(vendasData);
        setInsights(insightsData);
      } catch (err) {
        setError("Erro ao carregar dados");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // LOADING
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--background)] text-white">
        <p className="text-zinc-400">Carregando dashboard...</p>
      </div>
    );
  }

  // ERRO
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--background)] text-red-400">
        {error}
      </div>
    );
  }

  // MÉTRICAS
  const totalVendas = vendas.length;

  const faturamento = vendas.reduce(
    (acc, v) => acc + Number(v.total),
    0
  );

  const ticketMedio =
    vendas.length > 0 ? faturamento / vendas.length : 0;

  const estoqueCritico = produtos.filter(
    (p) => p.estoque <= p.minimo
  ).length;

  const alertas = produtos.map((p) => ({
    produto: p.nome,
    estoque: p.estoque,
    minimo: p.minimo,
  }));

  return (
    <div className="flex h-screen bg-[var(--background)] text-white">

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        <Header />

        <main className="p-6 space-y-6 overflow-y-auto">

          {/* CARDS */}
          <div className="grid grid-cols-4 gap-6">

            <MetricCard
              title="Faturamento Total"
              value={`R$ ${faturamento.toFixed(2)}`}
              icon={DollarSign}
            />

            <MetricCard
              title="Ticket Médio"
              value={`R$ ${ticketMedio.toFixed(2)}`}
              icon={BarChart3}
            />

            <MetricCard
              title="Total de Vendas"
              value={`${totalVendas}`}
              icon={ShoppingCart}
            />

            <MetricCard
              title="Estoque Crítico"
              value={`${estoqueCritico}`}
              icon={AlertTriangle}
            />

          </div>

          {/* GRID */}
          <div className="grid grid-cols-3 gap-6">

            <div className="col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">
                Vendas Diárias
              </h2>

              <SalesChart vendas={vendas} />
            </div>

            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">
                Produtos Mais Vendidos
              </h2>

              <ul className="space-y-3 text-sm">
                {produtos
                  .sort((a, b) => b.estoque - a.estoque)
                  .slice(0, 3)
                  .map((p, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{i + 1}. {p.nome}</span>
                      <span className="text-purple-400">
                        {p.estoque} un
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

          </div>

          {/* INSIGHTS */}
          <InsightsCard insights={insights} />

          {/* ALERTAS */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">
              Alertas de Estoque
            </h2>

            {alertas.map((item, index) => (
              <StockAlert key={index} {...item} />
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}