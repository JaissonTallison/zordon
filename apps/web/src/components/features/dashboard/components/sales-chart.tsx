"use client";

import { Venda } from "@/src/lib/types";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";



type SalesChartProps = {
  vendas: Venda[];
};

export function SalesChart({ vendas }: SalesChartProps) {
  const dataMap: Record<string, number> = {};

  vendas.forEach((v) => {
    const dia = new Date(v.data).toLocaleDateString();

    dataMap[dia] = (dataMap[dia] || 0) + Number(v.total);
  });

  const data = Object.entries(dataMap).map(([dia, valor]) => ({
    dia,
    valor,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="dia" stroke="#888888" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="#7c3aed"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}