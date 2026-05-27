import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp, DollarSign } from "lucide-react";
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
  red:       "#F87171",
  amber:     "#FBBF24",
  green:     "#34D399",
  brand:     "#0085E2",
};

function fmt(v) { return Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

function getCfg(codigo) {
  if (!codigo) return { color: C.t3, label: "—" };
  if (codigo.includes("PARADO") || codigo.includes("SEM_VENDAS")) return { color: C.red,   label: "Perda"   };
  if (codigo.includes("ESTOQUE"))                                  return { color: C.amber, label: "Risco"   };
  if (codigo.includes("ALTA_DEMANDA"))                             return { color: C.green, label: "Ganho"   };
  return { color: C.brand, label: "Análise" };
}

export default function Impact() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/engine/resultados");
        setData((res.data || []).map((d) => ({ ...d, impacto_valor: Number(d.impacto_valor || 0) })));
      } catch {} finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <Spinner />;

  const total  = data.reduce((a, d) => a + d.impacto_valor, 0);
  const perdas = data.filter((d) => d.codigo?.includes("PARADO") || d.codigo?.includes("SEM_VENDAS") || d.codigo?.includes("ESTOQUE_BAIXO")).reduce((a, d) => a + d.impacto_valor, 0);
  const ganhos = data.filter((d) => d.codigo?.includes("ALTA_DEMANDA")).reduce((a, d) => a + d.impacto_valor, 0);
  const sorted = [...data].sort((a, b) => b.impacto_valor - a.impacto_valor);
  const top5   = sorted.slice(0, 5);
  const maxVal = Math.max(...data.map((d) => d.impacto_valor), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", animation: "fade-in-up 0.35s ease-out" }}>

      {/* HERO */}
      <div style={{ background: C.card, border: "1px solid rgba(251,191,36,0.2)", borderRadius: "14px", padding: "28px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${C.amber}, transparent)`, opacity: 0.6 }} />
        <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "8px" }}>
              <DollarSign size={13} color={C.amber} />
              <span style={{ fontSize: "10px", color: C.amber, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Impacto total identificado</span>
            </div>
            <p style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: C.amber, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1, letterSpacing: "-0.03em" }}>
              R$ {fmt(total)}
            </p>
            <p style={{ fontSize: "12px", color: C.t3, marginTop: "8px" }}>{data.length} registros processados</p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            {[
              { icon: TrendingDown, label: "Perdas", value: perdas, color: C.red,   bg: "rgba(248,113,113,0.06)", bdr: "rgba(248,113,113,0.2)"  },
              { icon: TrendingUp,   label: "Ganhos", value: ganhos, color: C.green, bg: "rgba(52,211,153,0.06)",  bdr: "rgba(52,211,153,0.2)"   },
            ].map((k) => {
              const Icon = k.icon;
              return (
                <div key={k.label} style={{ padding: "12px 18px", borderRadius: "10px", background: k.bg, border: `1px solid ${k.bdr}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
                    <Icon size={11} color={k.color} />
                    <span style={{ fontSize: "10px", color: k.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.label}</span>
                  </div>
                  <p style={{ fontSize: "17px", fontWeight: 700, color: k.color, fontFamily: "'JetBrains Mono',monospace" }}>R$ {fmt(k.value)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TOP 5 */}
      <div>
        <div className="section-header">Top impactos</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {top5.map((d, i) => {
            const cfg = getCfg(d.codigo);
            const pct = Math.min((d.impacto_valor / maxVal) * 100, 100);
            return (
              <div key={d.id}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${cfg.color}`, borderRadius: "9px", padding: "12px 16px", transition: "all 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = C.cardHover; e.currentTarget.style.borderColor = C.borderHi; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.card;      e.currentTarget.style.borderColor = C.border;   }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "11px", color: C.t4, fontFamily: "'JetBrains Mono',monospace", width: "20px" }}>#{i + 1}</span>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: C.t1 }}>{d.produto_nome || d.codigo?.replaceAll("_", " ")}</p>
                      <span style={{ fontSize: "10px", padding: "1px 7px", borderRadius: "20px", background: `${cfg.color}10`, color: cfg.color, fontFamily: "'JetBrains Mono',monospace" }}>{cfg.label}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: "15px", fontWeight: 700, color: cfg.color, fontFamily: "'JetBrains Mono',monospace" }}>R$ {fmt(d.impacto_valor)}</p>
                </div>
                <div style={{ height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
                  <div className="progress-bar" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${cfg.color}50, ${cfg.color})` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TABLE */}
      <div>
        <div className="section-header">Todos os registros</div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 130px", padding: "10px 16px", borderBottom: `1px solid ${C.border}`, fontSize: "10px", color: C.t3, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            <span>Produto / Código</span><span style={{ textAlign: "center" }}>Tipo</span><span style={{ textAlign: "right" }}>Impacto</span>
          </div>
          {data.map((d, i) => {
            const cfg = getCfg(d.codigo);
            return (
              <div key={d.id} style={{ display: "grid", gridTemplateColumns: "1fr 100px 130px", padding: "10px 16px", borderBottom: i < data.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", transition: "background 0.12s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,133,226,0.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontSize: "13px", color: C.t2 }}>{d.produto_nome || d.codigo}</span>
                <span style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "20px", background: `${cfg.color}10`, color: cfg.color }}>{cfg.label}</span>
                </span>
                <span style={{ textAlign: "right", fontSize: "13px", fontWeight: 600, color: cfg.color, fontFamily: "'JetBrains Mono',monospace" }}>R$ {fmt(d.impacto_valor)}</span>
              </div>
            );
          })}
          {data.length === 0 && <div style={{ padding: "40px", textAlign: "center", color: C.t4, fontSize: "13px", fontFamily: "'JetBrains Mono',monospace" }}>Nenhum registro</div>}
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh", color: C.t3, fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", gap: "10px" }}>
      <div style={{ width: "16px", height: "16px", border: "2px solid rgba(0,133,226,0.15)", borderTopColor: "#0085E2", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
      Calculando impacto financeiro...
    </div>
  );
}
