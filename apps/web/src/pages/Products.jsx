import { useEffect, useState } from "react";
import { Package, AlertCircle, CheckCircle, ShoppingCart } from "lucide-react";
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
  brandLt:   "#38BDFF",
  brandBdr:  "rgba(0,133,226,0.4)",
};

export default function Products() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");

  useEffect(() => {
    async function load() {
      try { const res = await api.get("/produtos"); setProdutos(res.data || []); }
      catch {} finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <Spinner />;

  const total        = produtos.length;
  const estoqueTotal = produtos.reduce((a, p) => a + Number(p.estoque || 0), 0);
  const criticos     = produtos.filter((p) => Number(p.estoque) <= Number(p.minimo || 0));
  const normais      = produtos.filter((p) => Number(p.estoque) > Number(p.minimo || 0));
  const filtered     = produtos.filter((p) => !search || p.nome?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", animation: "fade-in-up 0.35s ease-out" }}>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
        {[
          { icon: Package,      label: "Total",    value: total,           accent: C.brand   },
          { icon: ShoppingCart, label: "Estoque",  value: estoqueTotal,    accent: C.brandLt },
          { icon: CheckCircle,  label: "Normais",  value: normais.length,  accent: C.green   },
          { icon: AlertCircle,  label: "Críticos", value: criticos.length, accent: C.red     },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "16px 18px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: k.accent, opacity: 0.5 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: "10px", color: C.t3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>{k.label}</p>
                  <p style={{ fontSize: "24px", fontWeight: 700, color: k.accent }}>{k.value}</p>
                </div>
                <div style={{ padding: "8px", borderRadius: "8px", background: `${k.accent}10`, border: `1px solid ${k.accent}20` }}>
                  <Icon size={15} color={k.accent} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CRITICAL ALERT */}
      {criticos.length > 0 && (
        <div style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "9px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: C.red, boxShadow: "0 0 8px rgba(248,113,113,0.8)", flexShrink: 0, animation: "pulse-red 1.8s ease-in-out infinite" }} />
          <span style={{ fontSize: "13px", fontWeight: 600, color: C.red }}>{criticos.length} produto{criticos.length > 1 ? "s" : ""} com estoque crítico</span>
          <span style={{ fontSize: "12px", color: C.t3 }}>— reposição recomendada imediatamente</span>
        </div>
      )}

      {/* SEARCH */}
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: C.t4, fontSize: "14px", pointerEvents: "none" }}>⌕</span>
        <input
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "9px 14px 9px 36px", borderRadius: "8px", background: C.card, border: `1px solid ${C.border}`, color: C.t1, fontSize: "13px", outline: "none", fontFamily: "inherit", transition: "border-color 0.2s" }}
          onFocus={(e) => (e.target.style.borderColor = C.brandBdr)}
          onBlur={(e)  => (e.target.style.borderColor = C.border)}
        />
      </div>

      {/* GRID */}
      <div>
        <div className="section-header">Inventário ({filtered.length})</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: "10px" }}>
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px", color: C.t4, fontFamily: "'JetBrains Mono',monospace", fontSize: "13px" }}>Nenhum produto encontrado</div>
          )}
          {filtered.map((p) => {
            const isCrit = Number(p.estoque) <= Number(p.minimo || 0);
            const minVal = Math.max(Number(p.minimo || 1) * 2, 1);
            const pct    = Math.min((Number(p.estoque) / minVal) * 100, 100);
            const bar    = isCrit ? C.red : pct > 60 ? C.green : C.amber;

            return (
              <div key={p.id}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `2px solid ${isCrit ? C.red : C.green}`, borderRadius: "10px", padding: "14px", position: "relative", transition: "all 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = C.cardHover; e.currentTarget.style.borderColor = C.borderHi; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.card;      e.currentTarget.style.borderColor = C.border;   }}
              >
                <div style={{ position: "absolute", top: "12px", right: "12px", width: "7px", height: "7px", borderRadius: "50%", background: isCrit ? C.red : C.green, boxShadow: `0 0 5px ${isCrit ? "rgba(248,113,113,0.8)" : "rgba(52,211,153,0.8)"}` }} />

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${isCrit ? C.red : C.brand}10`, border: `1px solid ${isCrit ? C.red : C.brand}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Package size={14} color={isCrit ? C.red : C.brand} />
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: C.t1, lineHeight: 1.2 }}>{p.nome}</p>
                    <p style={{ fontSize: "10px", color: isCrit ? C.red : C.green }}>{isCrit ? "CRÍTICO" : "NORMAL"}</p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "10px" }}>
                  {[
                    { label: "Estoque", value: p.estoque,     color: isCrit ? C.red : C.t1 },
                    { label: "Mínimo",  value: p.minimo || 0, color: C.t3                   },
                  ].map((s) => (
                    <div key={s.label} style={{ padding: "7px 10px", borderRadius: "6px", background: "rgba(8,10,19,0.6)", border: `1px solid ${C.border}` }}>
                      <p style={{ fontSize: "9px", color: C.t4, textTransform: "uppercase", marginBottom: "2px" }}>{s.label}</p>
                      <p style={{ fontSize: "16px", fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono',monospace" }}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
                  <div className="progress-bar" style={{ width: `${pct}%`, background: bar }} />
                </div>
                <p style={{ fontSize: "10px", color: C.t4, marginTop: "4px", textAlign: "right", fontFamily: "'JetBrains Mono',monospace" }}>{Math.round(pct)}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh", color: C.t3, fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", gap: "10px" }}>
      <div style={{ width: "16px", height: "16px", border: "2px solid rgba(0,133,226,0.15)", borderTopColor: "#0085E2", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
      Carregando inventário...
    </div>
  );
}
