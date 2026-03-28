import {
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";

type Insight = {
  tipo: "sucesso" | "alerta" | "info";
  mensagem: string;
};

type InsightsCardProps = {
  insights: Insight[];
};

export function InsightsCard({ insights }: InsightsCardProps) {
  function getStyle(tipo: string) {
    switch (tipo) {
      case "sucesso":
        return {
          icon: CheckCircle,
          color: "text-green-400",
          bg: "bg-green-500/10 border-green-500/30"
        };

      case "alerta":
        return {
          icon: AlertTriangle,
          color: "text-yellow-400",
          bg: "bg-yellow-500/10 border-yellow-500/30"
        };

      default:
        return {
          icon: Info,
          color: "text-blue-400",
          bg: "bg-blue-500/10 border-blue-500/30"
        };
    }
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 space-y-4">

      <h2 className="text-lg font-semibold">
        Insights Estratégicos
      </h2>

      <div className="space-y-3">

        {insights.map((item, index) => {
          const style = getStyle(item.tipo);
          const Icon = style.icon;

          return (
            <div
              key={index}
              className={`flex items-start gap-3 p-4 rounded-lg border ${style.bg}`}
            >
              {/* ÍCONE */}
              <Icon className={`w-5 h-5 mt-1 ${style.color}`} />

              {/* TEXTO */}
              <p className="text-sm text-zinc-300">
                {item.mensagem}
              </p>
            </div>
          );
        })}

      </div>
    </div>
  );
}