import { LucideIcon } from "lucide-react";

type MetricCardProps = {
  title: string;
  value: string;
  change?: number;
  icon: LucideIcon;
};

export function MetricCard({ title, value, change, icon: Icon }: MetricCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--card-hover)] rounded-xl p-5 flex flex-col gap-3 shadow-md hover:shadow-lg transition">

      {/* TOPO */}
      <div className="flex items-center justify-between">

        <span className="text-sm text-zinc-400">
          {title}
        </span>

        {/*  ÍCONE PROFISSIONAL */}
        <Icon className="w-5 h-5 text-zinc-400" />

      </div>

      {/* VALOR */}
      <span className="text-2xl font-bold tracking-tight">
        {value}
      </span>

      {/* VARIAÇÃO */}
      {change !== undefined && (
        <span
          className={`text-sm font-medium ${
            isPositive ? "text-green-400" : "text-red-400"
          }`}
        >
          {isPositive ? "↑" : "↓"} {Math.abs(change)}% vs mês anterior
        </span>
      )}

    </div>
  );
}