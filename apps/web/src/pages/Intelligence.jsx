import { useEffect, useState } from "react";
import { Brain, BarChart2, Compass, Sparkles } from "lucide-react";
import api from "../services/api";

const C = {
  card:      "#FFFFFF",
  card2:     "#F8FAFC",
  cardHover: "#F1F5F9",
  border:    "rgba(15,23,42,0.05)",
  t1:        "#0F172A",
  t2:        "#475569",
  t3:        "#64748B",
  t4:        "#94A3B8",
  amber:     "#B45309",
  green:     "#047857",
  brand:     "#0085E2",
  brandLt:   "#38BDFF",
  red:       "#DC2626",
  radius:    "18px",
  radiusSm:  "12px",
  shadow:    "0 1px 2px rgba(15,23,42,0.04), 0 10px 24px rgba(15,23,42,0.06)",
};

const INSIGHT = {
  tendencia: { label: "Tendência", color: C.brand, icon: BarChart2 },
  previsao:  { label: "Previsão",  color: C.brand, icon: Compass   },
  cenario:   { label: "Cenário",   color: C.amber, icon: Sparkles  },
};

function fmt(v) { return Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export default function Intelligence() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try { const res = await api.get("/engine/intelligence"); setData(res.data); }
      catch {} finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <Spinner />;
  if (!data)   return <div style={{ color: C.t3, fontSize: "15px" }}>Nenhum dado disponível</div>;

  const { insights, recomendacao_principal } = data;
  const allInsights = [
    ...(insights?.previsoes  || []).map((i) => ({ ...i, _cat: "previsao"  })),
    ...(insights?.tendencias || []).map((i) => ({ ...i, _cat: "tendencia" })),
    ...(insights?.cenarios   || []).map((i) => ({ ...i, _cat: "cenario"   })),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px", animation: "fade-in-up 0.35s ease-out" }}>

      {/* PRINCIPAL RECOMMENDATION */}
      {recomendacao_principal && (
        <div style={{ background: C.card, borderRadius: "20px", boxShadow: C.shadow, padding: "26px 28px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "200px", height: "200px", background: "radial-gradient(circle, rgba(0,133,226,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: C.radiusSm, background: "rgba(0,133,226,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Brain size={16} color={C.brand} />
            </div>
            <span style={{ fontSize: "13px", color: C.brand, fontWeight: 700 }}>Principal recomendação</span>
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: C.t1, marginBottom: "7px", letterSpacing: "-0.01em" }}>{recomendacao_principal.titulo || recomendacao_principal.codigo}</h2>
          <p style={{ fontSize: "14px", color: C.t2, lineHeight: 1.6 }}>{recomendacao_principal.descricao}</p>
          <p style={{ fontSize: "24px", fontWeight: 800, color: C.t1, marginTop: "14px", letterSpacing: "-0.02em" }}>R$ {fmt(recomendacao_principal.impacto_valor)}</p>
        </div>
      )}

      {/* INSIGHTS GRID */}
      {allInsights.length > 0 && (
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: C.t1, marginBottom: "12px", letterSpacing: "-0.01em" }}>Insights da engine</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: "14px" }}>
            {allInsights.map((item, i) => {
              const cfg  = INSIGHT[item._cat] || INSIGHT.previsao;
              const Icon = cfg.icon;
              return (
                <div key={i}
                  style={{ background: C.card, borderRadius: C.radius, boxShadow: C.shadow, padding: "18px 20px", transition: "background 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = C.cardHover; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = C.card; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "9px", flexShrink: 0, background: `${cfg.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={13} color={cfg.color} />
                    </div>
                    <span style={{ fontSize: "12px", color: cfg.color, fontWeight: 700 }}>{cfg.label}</span>
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: C.t1, marginBottom: "5px" }}>{item.titulo || item.tipo}</p>
                  <p style={{ fontSize: "13px", color: C.t3, lineHeight: 1.5 }}>{item.descricao}</p>
                  {item.impacto && <p style={{ fontSize: "16px", fontWeight: 700, color: C.t1, marginTop: "10px", letterSpacing: "-0.01em" }}>R$ {fmt(item.impacto)}</p>}
                  {item.confianca && (
                    <div style={{ marginTop: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontSize: "11px", color: C.t3 }}>Confiança</span>
                        <span style={{ fontSize: "11px", color: cfg.color, fontWeight: 700 }}>{Math.round(item.confianca * 100)}%</span>
                      </div>
                      <div style={{ height: "3px", background: "rgba(15,23,42,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                        <div className="progress-bar" style={{ width: `${item.confianca * 100}%`, background: cfg.color }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!recomendacao_principal && allInsights.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px", color: C.t3, background: C.card, borderRadius: C.radius, boxShadow: C.shadow, fontSize: "15px" }}>
          Nenhum insight disponível ainda. Execute a engine para gerar análises.
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh", color: C.t3, fontSize: "15px", gap: "10px" }}>
      <div style={{ width: "18px", height: "18px", border: "2px solid rgba(0,133,226,0.15)", borderTopColor: "#0085E2", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
      Processando inteligência...
    </div>
  );
}
