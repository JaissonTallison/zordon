import { useEffect, useState } from "react";
import { AlertTriangle, TrendingUp, Eye, XCircle, RotateCcw } from "lucide-react";
import api from "../services/api";
import ResolverMenu, { acaoLabel } from "../components/decision/ResolverMenu";

const C = {
  card:      "#FFFFFF",
  card2:     "#F8FAFC",
  cardHover: "#F1F5F9",
  border:    "rgba(15,23,42,0.05)",
  borderHi:  "rgba(0,133,226,0.25)",
  t1:        "#0F172A",
  t2:        "#475569",
  t3:        "#64748B",
  t4:        "#94A3B8",
  red:       "#DC2626",
  amber:     "#B45309",
  green:     "#047857",
  brand:     "#0085E2",
  brandLt:   "#38BDFF",
  brandBg:   "rgba(0,133,226,0.1)",
  brandBdr:  "rgba(0,133,226,0.35)",
  radius:    "18px",
  radiusSm:  "12px",
  shadow:    "0 1px 2px rgba(15,23,42,0.04), 0 10px 24px rgba(15,23,42,0.06)",
};

const TIPO = {
  problema:     { label: "Problema",     color: C.red,    icon: AlertTriangle },
  oportunidade: { label: "Oportunidade", color: C.green,  icon: TrendingUp    },
  alerta:       { label: "Alerta",       color: C.amber,  icon: Eye           },
};

const PRI = {
  CRITICA: { label: "Crítica", color: C.red    },
  ALTA:    { label: "Alta",    color: C.amber  },
  MEDIA:   { label: "Média",   color: C.brand  },
  BAIXA:   { label: "Baixa",   color: C.t3     },
};

function fmt(v) { return Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

// Descrições da engine repetem nome do produto e valor de impacto, que já
// aparecem em destaque na linha — removemos essa redundância aqui.
function cleanDescricao(descricao, nome, valorFormatado) {
  if (!descricao) return "";
  let s = descricao.trim();

  if (nome && s.toLowerCase().startsWith(nome.trim().toLowerCase())) {
    s = s.slice(nome.trim().length).trim();
  }

  if (valorFormatado) {
    const money = `R\\$\\s*${valorFormatado.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`;
    const re = new RegExp(`\\s*(com|de|em)?\\s*${money}(\\s+(em|de)\\s+\\w+(\\s+\\w+)?)?`, "i");
    const stripped = s.replace(re, " ").replace(/\s{2,}/g, " ").trim();
    if (stripped) s = stripped;
  }

  for (let i = 0; i < 2; i++) {
    const next = s.replace(/^(está|apresenta|com|possui)\s+/i, "");
    if (next === s) break;
    s = next;
  }
  if (s) s = s.charAt(0).toUpperCase() + s.slice(1);

  return s || descricao;
}

export default function Decisions() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");

  async function load() {
    try { const res = await api.get("/engine/decisions"); setData(res.data || null); }
    catch {} finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function atualizarStatus(id, status, acao) {
    try {
      await api.patch(`/engine/status/${id}`, { status, acao });
      setData((prev) => {
        if (!prev) return prev;
        const upd = (list) => list.map((d) => d.id === id ? { ...d, status, acao_aplicada: acao || d.acao_aplicada } : d);
        return { ...prev, decisoes: { problemas: upd(prev.decisoes.problemas), oportunidades: upd(prev.decisoes.oportunidades), alertas: upd(prev.decisoes.alertas) } };
      });
    } catch { load(); }
  }

  if (loading) return <Spinner label="Carregando decisões..." />;
  if (!data)   return <div style={{ color: C.t3, fontSize: "15px" }}>Sem dados</div>;

  const { decisoes } = data;
  const all = [
    ...decisoes.problemas.map((d) => ({ ...d, _tipo: "problema" })),
    ...decisoes.oportunidades.map((d) => ({ ...d, _tipo: "oportunidade" })),
    ...decisoes.alertas.map((d) => ({ ...d, _tipo: "alerta" })),
  ].sort((a, b) => Number(b.impacto_valor || 0) - Number(a.impacto_valor || 0));

  const maxImpact = Math.max(...all.map((d) => Number(d.impacto_valor || 0)), 1);
  const filtered  = filter === "all" ? all : all.filter((d) => d._tipo === filter);
  const pendentes = all.filter((d) => !d.status || d.status === "PENDENTE").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px", animation: "fade-in-up 0.35s ease-out" }}>

      {/* HEADER */}
      <div>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: C.t1, letterSpacing: "-0.01em" }}>Fila de decisões</h2>
        <p style={{ fontSize: "13px", color: C.t3, marginTop: "4px" }}>
          {pendentes} pendente{pendentes !== 1 ? "s" : ""} de {all.length} — ordenadas por impacto financeiro
        </p>
      </div>

      {/* FILTER TABS */}
      <div style={{ display: "flex", gap: "8px" }}>
        {[
          { id: "all",          label: `Todos (${all.length})`                              },
          { id: "problema",     label: `Problemas (${decisoes.problemas.length})`           },
          { id: "oportunidade", label: `Oportunidades (${decisoes.oportunidades.length})`   },
          { id: "alerta",       label: `Alertas (${decisoes.alertas.length})`               },
        ].map((t) => (
          <button key={t.id} onClick={() => setFilter(t.id)} style={{
            padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit", transition: "all 0.15s", border: "none",
            background: filter === t.id ? C.brandBg  : C.card2,
            color:      filter === t.id ? C.brand : C.t3,
          }}>{t.label}</button>
        ))}
      </div>

      {/* FEED */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px", color: C.t3, background: C.card, borderRadius: C.radius, boxShadow: C.shadow, fontSize: "14px" }}>
          Nenhuma decisão nesta categoria
        </div>
      ) : (
        <div style={{ background: C.card, borderRadius: C.radius, boxShadow: C.shadow, overflow: "visible" }}>
          {filtered.map((d, i) => (
            <DecisionCard key={d.id || i} item={d} tipo={d._tipo} atualizar={atualizarStatus} max={maxImpact} isFirst={i === 0} isLast={i === filtered.length - 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function DecisionCard({ item, tipo, atualizar, max, isFirst, isLast }) {
  const cfg   = TIPO[tipo] || TIPO.alerta;
  const Icon  = cfg.icon;
  const pri   = PRI[item.prioridade] || PRI.MEDIA;
  const pct   = Math.min((Number(item.impacto_valor || 0) / max) * 100, 100);
  const done  = item.status === "RESOLVIDO" || item.status === "IGNORADO";
  const nome  = item.produto_nome || item.codigo;
  const desc  = cleanDescricao(item.titulo_amigavel || item.descricao, nome, fmt(item.impacto_valor));

  return (
    <div
      style={{
        display: "flex", alignItems: "flex-start", gap: "14px",
        padding: "16px 22px",
        borderBottom: isLast ? "none" : `1px solid ${C.border}`,
        borderTopLeftRadius: isFirst ? C.radius : 0, borderTopRightRadius: isFirst ? C.radius : 0,
        borderBottomLeftRadius: isLast ? C.radius : 0, borderBottomRightRadius: isLast ? C.radius : 0,
        opacity: done ? 0.45 : 1, transition: "all 0.15s",
      }}
      onMouseEnter={(e) => { if (!done) e.currentTarget.style.background = C.cardHover; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{ width: "38px", height: "38px", borderRadius: C.radiusSm, flexShrink: 0, background: `${cfg.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={17} color={cfg.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "15px", fontWeight: 600, color: C.t1 }}>{nome}</span>
          <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 9px", borderRadius: "20px", background: `${pri.color}12`, color: pri.color }}>{pri.label}</span>
          {done && (
            <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 9px", borderRadius: "20px", background: item.status === "RESOLVIDO" ? "rgba(4,120,87,0.1)" : "rgba(100,116,139,0.1)", color: item.status === "RESOLVIDO" ? C.green : C.t3 }}>
              {item.status === "RESOLVIDO" ? (acaoLabel(item.acao_aplicada) || "Resolvido") : "Ignorado"}
            </span>
          )}
        </div>
        <p style={{ fontSize: "13px", color: C.t3, lineHeight: 1.4 }}>{desc}</p>
        {item.mensagem_recorrencia && (
          <p style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: C.red, marginTop: "4px" }}>
            <RotateCcw size={11} strokeWidth={2} style={{ flexShrink: 0 }} />
            {item.mensagem_recorrencia}
          </p>
        )}
        <div style={{ marginTop: "9px", height: "4px", background: "rgba(15,23,42,0.06)", borderRadius: "2px", overflow: "hidden", maxWidth: "260px" }}>
          <div className="progress-bar" style={{ width: `${pct}%`, background: cfg.color }} />
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ fontSize: "16px", fontWeight: 700, color: C.t1, letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums" }}>R$ {fmt(item.impacto_valor)}</p>
        {!done && (
          <div style={{ display: "flex", gap: "6px", marginTop: "8px", justifyContent: "flex-end" }}>
            <ResolverMenu size="sm" onResolver={(acao) => atualizar(item.id, "RESOLVIDO", acao)} />
            <button
              onClick={() => atualizar(item.id, "IGNORADO")}
              style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600, color: C.red, background: "rgba(220,38,38,0.08)", border: "none", borderRadius: "20px", padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}
            ><XCircle size={12} /> Ignorar</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Spinner({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh", color: C.t3, fontSize: "15px", gap: "10px" }}>
      <div style={{ width: "18px", height: "18px", border: "2px solid rgba(0,133,226,0.15)", borderTopColor: "#0085E2", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
      {label}
    </div>
  );
}
