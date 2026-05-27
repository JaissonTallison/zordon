import { useEffect, useState } from "react";
import { Brain, BarChart2, Compass, Sparkles } from "lucide-react";
import api from "../services/api";

const C = {
  card:      "#10141F",
  cardHover: "#181E2E",
  border:    "rgba(255,255,255,0.07)",
  borderHi:  "rgba(0,133,226,0.2)",
  t1:        "#F0F4FF",
  t2:        "#9BA8C0",
  t3:        "#5A6480",
  t4:        "#2E3550",
  amber:     "#FBBF24",
  green:     "#34D399",
  brand:     "#0085E2",
  brandLt:   "#38BDFF",
  red:       "#F87171",
};

const INSIGHT = {
  tendencia: { color: C.brand,   bg: "rgba(0,133,226,0.05)",   border: "rgba(0,133,226,0.18)",   icon: BarChart2 },
  previsao:  { color: C.brandLt, bg: "rgba(56,189,255,0.05)",  border: "rgba(56,189,255,0.18)",  icon: Compass   },
  cenario:   { color: C.amber,   bg: "rgba(251,191,36,0.05)",  border: "rgba(251,191,36,0.18)",  icon: Sparkles  },
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
  if (!data)   return <div style={{ color: C.t3 }}>Nenhum dado disponível</div>;

  const { resumo, insights, top, recomendacao_principal } = data;
  const allInsights = [
    ...(insights?.previsoes  || []).map((i) => ({ ...i, _cat: "previsao"  })),
    ...(insights?.tendencias || []).map((i) => ({ ...i, _cat: "tendencia" })),
    ...(insights?.cenarios   || []).map((i) => ({ ...i, _cat: "cenario"   })),
  ];
  const maxImpact = Math.max(...(top || []).map((d) => Number(d.impacto_valor || 0)), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", animation: "fade-in-up 0.35s ease-out" }}>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
        {[
          { label: "Impacto total",  value: `R$ ${fmt(resumo?.impacto_total)}`, accent: C.amber,  mono: true },
          { label: "Problemas",      value: resumo?.problemas ?? 0,             accent: C.red               },
          { label: "Oportunidades",  value: resumo?.oportunidades ?? 0,         accent: C.green             },
          { label: "Alertas",        value: resumo?.alertas ?? 0,               accent: C.brand             },
        ].map((k) => (
          <div key={k.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "16px 18px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: k.accent, opacity: 0.5 }} />
            <p style={{ fontSize: "10px", color: C.t3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>{k.label}</p>
            <p style={{ fontSize: "22px", fontWeight: 700, color: k.accent, fontFamily: k.mono ? "'JetBrains Mono',monospace" : "inherit" }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* PRINCIPAL RECOMMENDATION */}
      {recomendacao_principal && (
        <div style={{ background: C.card, border: "1px solid rgba(0,133,226,0.2)", borderLeft: `3px solid ${C.brand}`, borderRadius: "12px", padding: "20px 24px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, rgba(0,133,226,0.5), rgba(56,189,255,0.3), transparent)` }} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Brain size={13} color={C.brand} />
            <span style={{ fontSize: "10px", color: C.brand, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Principal recomendação</span>
          </div>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: C.t1, marginBottom: "6px" }}>{recomendacao_principal.titulo || recomendacao_principal.codigo}</h2>
          <p style={{ fontSize: "13px", color: C.t2, lineHeight: 1.6 }}>{recomendacao_principal.descricao}</p>
          <p style={{ fontSize: "20px", fontWeight: 700, color: C.brand, fontFamily: "'JetBrains Mono',monospace", marginTop: "12px" }}>R$ {fmt(recomendacao_principal.impacto_valor)}</p>
        </div>
      )}

      {/* TOP */}
      {top?.length > 0 && (
        <div>
          <div className="section-header">Top decisões</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {top.map((d, i) => {
              const pct = Math.min((Number(d.impacto_valor || 0) / maxImpact) * 100, 100);
              return (
                <div key={i}
                  style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: "3px solid rgba(0,133,226,0.5)", borderRadius: "9px", padding: "12px 16px", transition: "all 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = C.cardHover; e.currentTarget.style.borderColor = C.borderHi; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = C.card;      e.currentTarget.style.borderColor = C.border;   }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "11px", color: C.t4, fontFamily: "'JetBrains Mono',monospace" }}>#{i + 1}</span>
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 500, color: C.t1 }}>{d.titulo || d.codigo}</p>
                        <p style={{ fontSize: "11px", color: C.t3 }}>{d.descricao}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: C.brand, fontFamily: "'JetBrains Mono',monospace" }}>R$ {fmt(d.impacto_valor)}</p>
                  </div>
                  <div style={{ height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
                    <div className="progress-bar" style={{ width: `${pct}%`, background: `linear-gradient(90deg, rgba(0,133,226,0.5), ${C.brand})` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* INSIGHTS GRID */}
      {allInsights.length > 0 && (
        <div>
          <div className="section-header">Insights da engine</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "10px" }}>
            {allInsights.map((item, i) => {
              const cfg  = INSIGHT[item._cat] || INSIGHT.previsao;
              const Icon = cfg.icon;
              return (
                <div key={i}
                  style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderLeft: `3px solid ${cfg.color}`, borderRadius: "9px", padding: "14px 16px", transition: "all 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.12)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "8px" }}>
                    <Icon size={12} color={cfg.color} />
                    <span style={{ fontSize: "10px", color: cfg.color, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{item._cat}</span>
                  </div>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: C.t1, marginBottom: "4px" }}>{item.titulo || item.tipo}</p>
                  <p style={{ fontSize: "12px", color: C.t3, lineHeight: 1.5 }}>{item.descricao}</p>
                  {item.impacto && <p style={{ fontSize: "14px", fontWeight: 700, color: cfg.color, fontFamily: "'JetBrains Mono',monospace", marginTop: "8px" }}>R$ {fmt(item.impacto)}</p>}
                  {item.confianca && (
                    <div style={{ marginTop: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                        <span style={{ fontSize: "10px", color: C.t4 }}>confiança</span>
                        <span style={{ fontSize: "10px", color: cfg.color, fontFamily: "'JetBrains Mono',monospace" }}>{Math.round(item.confianca * 100)}%</span>
                      </div>
                      <div style={{ height: "2px", background: "rgba(255,255,255,0.05)", borderRadius: "1px", overflow: "hidden" }}>
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
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh", color: C.t3, fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", gap: "10px" }}>
      <div style={{ width: "16px", height: "16px", border: "2px solid rgba(0,133,226,0.15)", borderTopColor: "#0085E2", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
      Processando inteligência...
    </div>
  );
}
