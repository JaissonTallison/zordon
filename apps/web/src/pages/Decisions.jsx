import { useEffect, useState } from "react";
import { AlertTriangle, TrendingUp, Eye, Flame, CheckCircle, XCircle } from "lucide-react";
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
  brandBg:   "rgba(0,133,226,0.1)",
  brandBdr:  "rgba(0,133,226,0.35)",
};

const TIPO = {
  problema:     { label: "Problema",     color: C.red,    bg: "rgba(248,113,113,0.05)", border: "rgba(248,113,113,0.18)", icon: AlertTriangle },
  oportunidade: { label: "Oportunidade", color: C.green,  bg: "rgba(52,211,153,0.05)",  border: "rgba(52,211,153,0.18)",  icon: TrendingUp    },
  alerta:       { label: "Alerta",       color: C.amber,  bg: "rgba(251,191,36,0.05)",  border: "rgba(251,191,36,0.18)",  icon: Eye           },
};

const PRI = {
  CRITICA: { label: "CRÍTICA", color: C.red,    bg: "rgba(248,113,113,0.1)"  },
  ALTA:    { label: "ALTA",    color: C.amber,  bg: "rgba(251,191,36,0.1)"   },
  MEDIA:   { label: "MÉDIA",   color: C.brandLt,bg: "rgba(56,189,255,0.1)"   },
  BAIXA:   { label: "BAIXA",   color: C.t3,     bg: "rgba(90,100,128,0.1)"   },
};

function fmt(v) { return Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export default function Decisions() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");

  async function load() {
    try { const res = await api.get("/engine/decisions"); setData(res.data || null); }
    catch {} finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function atualizarStatus(id, status) {
    try {
      await api.patch(`/engine/status/${id}`, { status });
      setData((prev) => {
        if (!prev) return prev;
        const upd = (list) => list.map((d) => d.id === id ? { ...d, status } : d);
        return { ...prev, decisoes: { problemas: upd(prev.decisoes.problemas), oportunidades: upd(prev.decisoes.oportunidades), alertas: upd(prev.decisoes.alertas) } };
      });
    } catch { load(); }
  }

  if (loading) return <Spinner label="Carregando decisões..." />;
  if (!data)   return <div style={{ color: C.t3 }}>Sem dados</div>;

  const { resumo, decisoes } = data;
  const all = [
    ...decisoes.problemas.map((d) => ({ ...d, _tipo: "problema" })),
    ...decisoes.oportunidades.map((d) => ({ ...d, _tipo: "oportunidade" })),
    ...decisoes.alertas.map((d) => ({ ...d, _tipo: "alerta" })),
  ].sort((a, b) => Number(b.impacto_valor || 0) - Number(a.impacto_valor || 0));

  const top3      = all.slice(0, 3);
  const maxImpact = Math.max(...all.map((d) => Number(d.impacto_valor || 0)), 1);
  const filtered  = filter === "all" ? all : all.filter((d) => d._tipo === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", animation: "fade-in-up 0.35s ease-out" }}>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
        {[
          { label: "Impacto total",  value: `R$ ${fmt(resumo.impacto_total)}`, accent: C.amber,  mono: true },
          { label: "Problemas",      value: resumo.problemas,                   accent: C.red              },
          { label: "Oportunidades",  value: resumo.oportunidades,               accent: C.green            },
          { label: "Alertas",        value: resumo.alertas,                     accent: C.brand            },
        ].map((k) => (
          <div key={k.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "16px 18px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: k.accent, opacity: 0.5 }} />
            <p style={{ fontSize: "10px", color: C.t3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>{k.label}</p>
            <p style={{ fontSize: "22px", fontWeight: 700, color: k.accent, fontFamily: k.mono ? "'JetBrains Mono',monospace" : "inherit" }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* TOP 3 */}
      {top3.length > 0 && (
        <div style={{ background: C.card, border: "1px solid rgba(251,191,36,0.2)", borderRadius: "12px", padding: "18px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <Flame size={14} color={C.amber} />
            <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: C.amber }}>Ações prioritárias agora</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {top3.map((d, i) => {
              const cfg = TIPO[d._tipo] || TIPO.alerta;
              const pct = Math.min((Number(d.impacto_valor || 0) / maxImpact) * 100, 100);
              return (
                <div key={d.id} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{ fontSize: "11px", fontFamily: "'JetBrains Mono',monospace", color: C.t4, width: "20px", textAlign: "right" }}>#{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "13px", color: C.t1, fontWeight: 500 }}>{d.produto_nome || d.codigo}</span>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: cfg.color, fontFamily: "'JetBrains Mono',monospace" }}>R$ {fmt(d.impacto_valor)}</span>
                    </div>
                    <div style={{ height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
                      <div className="progress-bar" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${cfg.color}50, ${cfg.color})` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FILTER TABS */}
      <div style={{ display: "flex", gap: "6px" }}>
        {[
          { id: "all",          label: `Todos (${all.length})`                              },
          { id: "problema",     label: `Problemas (${decisoes.problemas.length})`           },
          { id: "oportunidade", label: `Oportunidades (${decisoes.oportunidades.length})`   },
          { id: "alerta",       label: `Alertas (${decisoes.alertas.length})`               },
        ].map((t) => (
          <button key={t.id} onClick={() => setFilter(t.id)} style={{
            padding: "6px 14px", borderRadius: "6px", fontSize: "12px", cursor: "pointer",
            fontFamily: "inherit", transition: "all 0.15s",
            background: filter === t.id ? C.brandBg  : "rgba(16,20,31,0.8)",
            border:     filter === t.id ? `1px solid ${C.brandBdr}` : `1px solid ${C.border}`,
            color:      filter === t.id ? C.brand : C.t3,
          }}>{t.label}</button>
        ))}
      </div>

      {/* FEED */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: C.t4, fontFamily: "'JetBrains Mono',monospace", fontSize: "13px" }}>
            Nenhuma decisão nesta categoria
          </div>
        )}
        {filtered.map((d, i) => <DecisionCard key={d.id || i} item={d} tipo={d._tipo} atualizar={atualizarStatus} max={maxImpact} />)}
      </div>
    </div>
  );
}

function DecisionCard({ item, tipo, atualizar, max }) {
  const cfg   = TIPO[tipo] || TIPO.alerta;
  const Icon  = cfg.icon;
  const pri   = PRI[item.prioridade] || PRI.MEDIA;
  const pct   = Math.min((Number(item.impacto_valor || 0) / max) * 100, 100);
  const done  = item.status === "RESOLVIDO" || item.status === "IGNORADO";

  return (
    <div
      style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${cfg.color}`, borderRadius: "9px", padding: "12px 16px", opacity: done ? 0.4 : 1, transition: "all 0.15s" }}
      onMouseEnter={(e) => { if (!done) { e.currentTarget.style.background = C.cardHover; e.currentTarget.style.borderColor = C.borderHi; }}}
      onMouseLeave={(e) => { e.currentTarget.style.background = C.card; e.currentTarget.style.borderColor = C.border; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <div style={{ width: "30px", height: "30px", borderRadius: "7px", flexShrink: 0, background: `${cfg.color}10`, border: `1px solid ${cfg.color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={13} color={cfg.color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px", fontWeight: 500, color: C.t1 }}>{item.produto_nome || item.codigo}</span>
            <span style={{ fontSize: "10px", padding: "1px 7px", borderRadius: "20px", background: pri.bg, color: pri.color, fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.06em" }}>{pri.label}</span>
            {done && <span style={{ fontSize: "10px", padding: "1px 7px", borderRadius: "20px", background: item.status === "RESOLVIDO" ? "rgba(52,211,153,0.1)" : "rgba(90,100,128,0.1)", color: item.status === "RESOLVIDO" ? C.green : C.t3, fontFamily: "'JetBrains Mono',monospace" }}>{item.status}</span>}
          </div>
          <p style={{ fontSize: "12px", color: C.t3, lineHeight: 1.4 }}>{item.titulo_amigavel || item.descricao}</p>
          {item.mensagem_recorrencia && <p style={{ fontSize: "11px", color: C.red, marginTop: "3px" }}>↻ {item.mensagem_recorrencia}</p>}
          <div style={{ marginTop: "8px", height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
            <div className="progress-bar" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${cfg.color}50, ${cfg.color})` }} />
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontSize: "15px", fontWeight: 700, color: cfg.color, fontFamily: "'JetBrains Mono',monospace" }}>R$ {fmt(item.impacto_valor)}</p>
          {!done && (
            <div style={{ display: "flex", gap: "5px", marginTop: "7px", justifyContent: "flex-end" }}>
              <button className="btn-success" onClick={() => atualizar(item.id, "RESOLVIDO")}><CheckCircle size={11} /> Resolver</button>
              <button className="btn-danger"  onClick={() => atualizar(item.id, "IGNORADO")}><XCircle size={11} /> Ignorar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Spinner({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh", color: C.t3, fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", gap: "10px" }}>
      <div style={{ width: "16px", height: "16px", border: "2px solid rgba(0,133,226,0.15)", borderTopColor: "#0085E2", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
      {label}
    </div>
  );
}
