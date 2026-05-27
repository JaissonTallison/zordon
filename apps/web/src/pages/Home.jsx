import { useEffect, useState, useRef } from "react";
import { AlertTriangle, TrendingUp, Eye, CheckCircle, XCircle, Zap, Activity } from "lucide-react";
import api from "../services/api";
import useEngineRealtime from "../hooks/useEngineRealtime";

// ── Palette ──────────────────────────────────────────────────
const C = {
  card:      "#10141F",
  card2:     "#141926",
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
  brandBg:   "rgba(0,133,226,0.08)",
  brandBdr:  "rgba(0,133,226,0.2)",
};

const TYPE = {
  problema:     { label: "Problema",     color: C.red,    bg: "rgba(248,113,113,0.05)", border: "rgba(248,113,113,0.18)", icon: AlertTriangle },
  alerta:       { label: "Alerta",       color: C.amber,  bg: "rgba(251,191,36,0.05)",  border: "rgba(251,191,36,0.18)",  icon: AlertTriangle },
  oportunidade: { label: "Oportunidade", color: C.green,  bg: "rgba(52,211,153,0.05)",  border: "rgba(52,211,153,0.18)",  icon: TrendingUp    },
  previsao:     { label: "Previsão",     color: C.brand,  bg: "rgba(0,133,226,0.05)",   border: "rgba(0,133,226,0.18)",   icon: Eye           },
};

function fmt(v) { return Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

// ─────────────────────────────────────────────────────────────
export default function Home() {
  const [data,    setData]    = useState({ problemas: [], alertas: [], oportunidades: [], previsoes: [] });
  const [loading, setLoading] = useState(true);
  const [scoreData, setScoreData] = useState(null);
  const hasLoaded = useRef(false);

  const { connected, engineStatus, score: scoreRT, alertasCriticos } = useEngineRealtime();
  useEffect(() => { if (scoreRT) setScoreData(scoreRT); }, [scoreRT]);

  async function load() {
    try {
      const [res, scoreRes] = await Promise.allSettled([
        api.post("/engine/executar"),
        api.get("/engine/score"),
      ]);

      const lista = res.status === "fulfilled" && Array.isArray(res.value?.data)
        ? res.value.data : [];

      setData({
        problemas:     lista.filter((d) => d.tipo === "problema"),
        alertas:       lista.filter((d) => d.tipo === "alerta"),
        oportunidades: lista.filter((d) => d.tipo === "oportunidade"),
        previsoes:     lista.filter((d) => d.tipo === "previsao"),
      });

      if (scoreRes.status === "fulfilled") setScoreData(scoreRes.value?.data || null);
    } catch {
      setData({ problemas: [], alertas: [], oportunidades: [], previsoes: [] });
    } finally {
      setLoading(false);
    }
  }

  async function atualizar(id, status) {
    try { await api.patch(`/engine/status/${id}`, { status }); load(); } catch {}
  }

  useEffect(() => { if (hasLoaded.current) return; hasLoaded.current = true; load(); }, []);

  if (loading) return <Spinner label="Executando engine de decisão..." />;

  const all       = [...data.problemas, ...data.alertas, ...data.oportunidades, ...data.previsoes];
  const total     = all.reduce((a, d) => a + Number(d.impacto_valor || 0), 0);
  const maxImpact = Math.max(...all.map((d) => Number(d.impacto_valor || 0)), 1);
  const principal = data.problemas[0] || data.alertas[0] || data.oportunidades[0] || data.previsoes[0] || null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", animation: "fade-in-up 0.35s ease-out" }}>

      {/* LIVE INDICATOR */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <LiveIndicator connected={connected} engineStatus={engineStatus} />
        {alertasCriticos.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 12px", borderRadius: "20px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.red, animation: "pulse-red 1.5s infinite" }} />
            <span style={{ fontSize: "11px", color: C.red, fontWeight: 600 }}>{alertasCriticos.length} alerta{alertasCriticos.length > 1 ? "s" : ""} crítico{alertasCriticos.length > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* KPI ROW + SCORE */}
      <div style={{ display: "grid", gridTemplateColumns: scoreData ? "repeat(4,1fr) 1.1fr" : "repeat(4,1fr)", gap: "12px", alignItems: "stretch" }}>
        <KpiCard label="Impacto total"   value={`R$ ${fmt(total)}`}                                    sub={`${all.length} análises`} accent={C.amber}  mono />
        <KpiCard label="Problemas"       value={data.problemas.length}                                 sub="requerem atenção"         accent={C.red}          />
        <KpiCard label="Oportunidades"   value={data.oportunidades.length}                             sub="de melhoria"              accent={C.green}        />
        <KpiCard label="Alertas"         value={data.alertas.length + data.previsoes.length}           sub="em monitor"               accent={C.brand}        />
        {scoreData && <ScoreCard data={scoreData} />}
      </div>

      {/* PRINCIPAL */}
      {principal && <PrincipalCard item={principal} atualizar={atualizar} />}

      {/* SECTIONS */}
      <Section title="Problemas Críticos"  items={data.problemas}     tipo="problema"     atualizar={atualizar} max={maxImpact} />
      <Section title="Alertas"             items={data.alertas}       tipo="alerta"       atualizar={atualizar} max={maxImpact} />
      <Section title="Oportunidades"       items={data.oportunidades} tipo="oportunidade" atualizar={atualizar} max={maxImpact} />
      <Section title="Previsões"           items={data.previsoes}     tipo="previsao"     atualizar={atualizar} max={maxImpact} />

      {all.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px", color: C.t4, fontFamily: "'JetBrains Mono',monospace", fontSize: "13px" }}>
          Nenhuma decisão encontrada. Execute a engine para analisar dados.
        </div>
      )}
    </div>
  );
}

// ── LIVE INDICATOR ────────────────────────────────────────────
function LiveIndicator({ connected, engineStatus }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <div style={{
          width: "7px", height: "7px", borderRadius: "50%",
          background: connected ? C.green : C.t4,
          boxShadow: connected ? "0 0 6px rgba(52,211,153,0.8)" : "none",
          transition: "all 0.3s",
        }} />
        <span style={{ fontSize: "11px", color: connected ? C.green : C.t4, fontFamily: "'JetBrains Mono',monospace" }}>
          {connected ? "LIVE" : "OFFLINE"}
        </span>
      </div>
      {engineStatus && (
        <span style={{ fontSize: "11px", color: C.t4 }}>
          · última execução: {engineStatus.total} decisões · R$ {fmt(engineStatus.impacto_total)}
        </span>
      )}
    </div>
  );
}

// ── SCORE CARD ────────────────────────────────────────────────
function ScoreCard({ data }) {
  const { score_operacional: score, saude, dimensoes } = data;
  const cor = saude?.cor || C.brand;

  const raio  = 34;
  const circ  = 2 * Math.PI * raio;
  const arco  = circ * 0.75;
  const fill  = arco * (score / 100);

  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: "10px", padding: "16px 18px",
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column", gap: "8px",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: cor, opacity: 0.6 }} />
      <p style={{ fontSize: "10px", color: C.t3, textTransform: "uppercase", letterSpacing: "0.08em" }}>Score Operacional</p>

      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ position: "relative", width: "80px", height: "80px", flexShrink: 0 }}>
          <svg width="80" height="80" style={{ transform: "rotate(135deg)" }}>
            <circle cx="40" cy="40" r={raio}
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7"
              strokeDasharray={`${arco} ${circ - arco}`}
              strokeLinecap="round"
            />
            <circle cx="40" cy="40" r={raio}
              fill="none" stroke={cor} strokeWidth="7"
              strokeDasharray={`${fill} ${circ - fill}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 1s ease" }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: "20px", fontWeight: 800, color: cor, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: "9px", color: C.t4, textTransform: "uppercase" }}>/ 100</span>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "5px" }}>
          {dimensoes && Object.entries({
            Impacto:     dimensoes.impacto,
            Urgência:    dimensoes.urgencia,
            Recorrência: dimensoes.recorrencia,
            Confiança:   dimensoes.confianca,
          }).map(([label, val]) => (
            <div key={label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <span style={{ fontSize: "9px", color: C.t4 }}>{label}</span>
                <span style={{ fontSize: "9px", color: cor, fontFamily: "'JetBrains Mono',monospace" }}>{val}</span>
              </div>
              <div style={{ height: "2px", background: "rgba(255,255,255,0.05)", borderRadius: "1px", overflow: "hidden" }}>
                <div style={{ width: `${val}%`, height: "100%", background: cor, borderRadius: "1px", transition: "width 0.8s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <Activity size={10} color={cor} />
        <span style={{ fontSize: "11px", color: cor, fontWeight: 600 }}>{saude?.nivel}</span>
        <span style={{ fontSize: "11px", color: C.t4 }}>· risco operacional</span>
      </div>
    </div>
  );
}

// ── KPI CARD ──────────────────────────────────────────────────
function KpiCard({ label, value, sub, accent, mono }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "16px 18px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: accent, opacity: 0.6 }} />
      <p style={{ fontSize: "10px", color: C.t3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>{label}</p>
      <p style={{ fontSize: "22px", fontWeight: 700, color: accent, lineHeight: 1.2, fontFamily: mono ? "'JetBrains Mono',monospace" : "inherit" }}>{value}</p>
      <p style={{ fontSize: "11px", color: C.t4, marginTop: "4px" }}>{sub}</p>
    </div>
  );
}

// ── PRINCIPAL CARD ────────────────────────────────────────────
function PrincipalCard({ item, atualizar }) {
  const cfg  = TYPE[item.tipo] || TYPE.alerta;
  const Icon = cfg.icon;
  return (
    <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderLeft: `3px solid ${cfg.color}`, borderRadius: "12px", padding: "20px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "160px", height: "160px", background: `radial-gradient(circle, ${cfg.color}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ display: "flex", gap: "12px", flex: 1 }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "8px", flexShrink: 0, background: `${cfg.color}12`, border: `1px solid ${cfg.color}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={16} color={cfg.color} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "15px", fontWeight: 600, color: C.t1 }}>{item.produto_nome || item.titulo}</span>
              <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "20px", background: `${cfg.color}12`, color: cfg.color, border: `1px solid ${cfg.color}25`, textTransform: "uppercase", letterSpacing: "0.06em" }}>{cfg.label}</span>
            </div>
            <p style={{ fontSize: "13px", color: C.t2, lineHeight: 1.5 }}>{item.descricao}</p>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontSize: "10px", color: C.t3, marginBottom: "4px" }}>impacto</p>
          <p style={{ fontSize: "20px", fontWeight: 700, color: cfg.color, fontFamily: "'JetBrains Mono',monospace" }}>R$ {fmt(item.impacto_valor)}</p>
        </div>
      </div>
      {item.recomendacao?.acao && (
        <div style={{ marginTop: "14px", padding: "10px 14px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", borderLeft: `2px solid ${cfg.color}35`, fontSize: "13px", color: C.t2 }}>
          <span style={{ color: cfg.color, marginRight: "6px" }}>→</span>{item.recomendacao.acao}
        </div>
      )}
      <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
        <button className="btn-success" onClick={() => atualizar(item.id, "RESOLVIDO")}><CheckCircle size={12} /> Resolver</button>
        <button className="btn-danger"  onClick={() => atualizar(item.id, "IGNORADO")}><XCircle size={12} /> Ignorar</button>
      </div>
    </div>
  );
}

// ── SECTION ───────────────────────────────────────────────────
function Section({ title, items, tipo, atualizar, max }) {
  if (!items.length) return null;
  const cfg = TYPE[tipo] || TYPE.alerta;
  return (
    <div>
      <div className="section-header">{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {items.map((d, i) => <DecisionRow key={d.id || i} item={d} cfg={cfg} atualizar={atualizar} max={max} />)}
      </div>
    </div>
  );
}

function DecisionRow({ item, cfg, atualizar, max }) {
  const pct = Math.min((Number(item.impacto_valor || 0) / max) * 100, 100);
  return (
    <div
      style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${cfg.color}`, borderRadius: "9px", padding: "12px 16px", transition: "all 0.15s" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = C.cardHover; e.currentTarget.style.borderColor = C.borderHi; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = C.card;      e.currentTarget.style.borderColor = C.border;   }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "13px", fontWeight: 500, color: C.t1, marginBottom: "2px" }}>{item.produto_nome || item.titulo}</p>
          <p style={{ fontSize: "12px", color: C.t3, lineHeight: 1.4 }}>{item.descricao}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "16px" }}>
          <p style={{ fontSize: "14px", fontWeight: 700, color: cfg.color, fontFamily: "'JetBrains Mono',monospace" }}>R$ {fmt(item.impacto_valor)}</p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "5px" }}>
            <button onClick={() => atualizar(item.id, "RESOLVIDO")} style={{ fontSize: "11px", color: C.green, background: "none", border: "none", cursor: "pointer", padding: 0 }}>resolver</button>
            <span style={{ color: C.t4 }}>·</span>
            <button onClick={() => atualizar(item.id, "IGNORADO")}  style={{ fontSize: "11px", color: C.red,   background: "none", border: "none", cursor: "pointer", padding: 0 }}>ignorar</button>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "10px", height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
        <div className="progress-bar" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${cfg.color}60, ${cfg.color})` }} />
      </div>
    </div>
  );
}

function Spinner({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: C.t3, fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", gap: "10px" }}>
      <div style={{ width: "16px", height: "16px", border: "2px solid rgba(0,133,226,0.15)", borderTopColor: "#0085E2", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
      {label}
    </div>
  );
}
