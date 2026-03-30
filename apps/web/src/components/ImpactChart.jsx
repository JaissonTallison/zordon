import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function ImpactChart({ data }) {
  const colors = ["#ef4444", "#7C3AED"];

  return (
    <div className="bg-white p-5 rounded-xl border shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        Impacto Financeiro
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="nome" />
          <YAxis />
          <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />

          <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={colors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}