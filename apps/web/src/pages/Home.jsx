import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, TrendingUp, Eye, XCircle, Zap, Activity, ArrowRight } from "lucide-react";
import api from "../services/api";
import useEngineRealtime from "../hooks/useEngineRealtime";
import ResolverMenu from "../components/decision/ResolverMenu";

// ── Palette ──────────────────────────────────────────────────
// NOTE: paleta + estilo de card (raio maior, sombra em vez de borda) é um
// PROTÓTIPO isolado nesta página — ainda não propagado para o resto do app.
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
  brandBg:   "rgba(0,133,226,0.08)",
  brandBdr:  "rgba(0,133,226,0.2)",
  radius:    "18px",
  radiusSm:  "12px",
  shadow:    "0 1px 2px rgba(15,23,42,0.04), 0 10px 24px rgba(15,23,42,0.06)",
};

const TYPE = {
  problema:     { label: "Problema",     color: C.red,    icon: AlertTriangle },
  alerta:       { label: "Alerta",       color: C.amber,  icon: AlertTriangle },
  oportunidade: { label: "Oportunidade", color: C.green,  icon: TrendingUp    },
  previsao:     { label: "Previsão",     color: C.brand,  icon: Eye           },
};

function fmt(v) { return Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

// Descrições vindas da engine repetem o nome do produto e o valor de impacto
// (ambos já exibidos em destaque na linha/card) — aqui removemos essa
// redundância pra deixar o texto direto ao ponto.
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

function truncate(s, max = 72) {
  if (!s) return s;
  return s.length > max ? s.slice(0, max).trimEnd() + "…" : s;
}

// ─────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
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

  async function atualizar(id, status, acao) {
    try { await api.patch(`/engine/status/${id}`, { status, acao }); load(); } catch {}
  }

  useEffect(() => { if (hasLoaded.current) return; hasLoaded.current = true; load(); }, []);

  if (loading) return <Spinner label="Executando engine de decisão..." />;

  const all       = [...data.problemas, ...data.alertas, ...data.oportunidades, ...data.previsoes];
  const total     = all.reduce((a, d) => a + Number(d.impacto_valor || 0), 0);
  const maxImpact = Math.max(...all.map((d) => Number(d.impacto_valor || 0)), 1);
  const principal = data.problemas[0] || data.alertas[0] || data.oportunidades[0] || data.previsoes[0] || null;
  const proximas  = all
    .filter((d) => d !== principal)
    .sort((a, b) => Number(b.impacto_valor || 0) - Number(a.impacto_valor || 0))
    .slice(0, 4);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px", animation: "fade-in-up 0.35s ease-out" }}>

      {/* LIVE INDICATOR */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <LiveIndicator connected={connected} engineStatus={engineStatus} />
        {alertasCriticos.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "7px 14px", borderRadius: "20px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.18)" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.red, animation: "pulse-red 1.5s infinite" }} />
            <span style={{ fontSize: "13px", color: C.red, fontWeight: 600 }}>{alertasCriticos.length} alerta{alertasCriticos.length > 1 ? "s" : ""} crítico{alertasCriticos.length > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* KPI ROW + SCORE */}
      <div style={{ display: "grid", gridTemplateColumns: scoreData ? "repeat(4,1fr) 1.1fr" : "repeat(4,1fr)", gap: "16px", alignItems: "stretch" }}>
        <KpiCard icon={Zap}           label="Impacto total"   value={`R$ ${fmt(total)}`}                          sub={`${all.length} análises`} accent={C.amber} />
        <KpiCard icon={AlertTriangle} label="Problemas"       value={data.problemas.length}                       sub="requerem atenção"         accent={C.red}   />
        <KpiCard icon={TrendingUp}    label="Oportunidades"   value={data.oportunidades.length}                   sub="de melhoria"              accent={C.green} />
        <KpiCard icon={Eye}           label="Alertas"         value={data.alertas.length + data.previsoes.length} sub="em monitor"               accent={C.brand} />
        {scoreData && <ScoreCard data={scoreData} />}
      </div>

      {/* PRINCIPAL */}
      {principal && <PrincipalCard item={principal} atualizar={atualizar} />}

      {/* PRÓXIMAS AÇÕES — teaser curto; a fila completa e filtrável vive em Decisões */}
      {proximas.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: C.t1, letterSpacing: "-0.01em" }}>Próximas ações</h3>
            <button
              onClick={() => navigate("/decisions")}
              style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", fontWeight: 600, color: C.brand, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}
            >
              Ver todas as decisões <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ background: C.card, borderRadius: C.radius, boxShadow: C.shadow, overflow: "visible" }}>
            {proximas.map((d, i) => (
              <DecisionRow key={d.id || i} item={d} atualizar={atualizar} max={maxImpact} isFirst={i === 0} isLast={i === proximas.length - 1} />
            ))}
          </div>
        </div>
      )}

      {all.length === 0 && (
        <div style={{
          textAlign: "center", padding: "60px", color: C.t3,
          background: C.card, borderRadius: C.radius, boxShadow: C.shadow,
          fontSize: "15px",
        }}>
          Nenhuma decisão encontrada. Execute a engine para analisar dados.
        </div>
      )}
    </div>
  );
}

// ── LIVE INDICATOR ────────────────────────────────────────────
function LiveIndicator({ connected, engineStatus }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      padding: "8px 16px", borderRadius: "20px",
      background: C.card, boxShadow: C.shadow,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{
          width: "7px", height: "7px", borderRadius: "50%",
          background: connected ? C.green : C.t4,
          boxShadow: connected ? "0 0 6px rgba(4,120,87,0.5)" : "none",
          transition: "all 0.3s",
        }} />
        <span style={{ fontSize: "13px", fontWeight: 700, color: connected ? C.green : C.t4 }}>
          {connected ? "Ao vivo" : "Offline"}
        </span>
      </div>
      {engineStatus && (
        <span style={{ fontSize: "13px", color: C.t3 }}>
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
      background: C.card, borderRadius: C.radius, boxShadow: C.shadow,
      padding: "22px 24px",
      display: "flex", flexDirection: "column", gap: "12px",
    }}>
      <p style={{ fontSize: "13px", color: C.t2, fontWeight: 600 }}>Score operacional</p>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ position: "relative", width: "82px", height: "82px", flexShrink: 0 }}>
          <svg width="82" height="82" style={{ transform: "rotate(135deg)" }}>
            <circle cx="41" cy="41" r={raio}
              fill="none" stroke="rgba(15,23,42,0.06)" strokeWidth="7"
              strokeDasharray={`${arco} ${circ - arco}`}
              strokeLinecap="round"
            />
            <circle cx="41" cy="41" r={raio}
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
            <span style={{ fontSize: "24px", fontWeight: 800, color: C.t1, lineHeight: 1, letterSpacing: "-0.02em" }}>{score}</span>
            <span style={{ fontSize: "10px", color: C.t4, fontWeight: 500 }}>/ 100</span>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
          {dimensoes && Object.entries({
            Impacto:     dimensoes.impacto,
            Urgência:    dimensoes.urgencia,
            Recorrência: dimensoes.recorrencia,
            Confiança:   dimensoes.confianca,
          }).map(([label, val]) => (
            <div key={label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ fontSize: "11px", color: C.t3 }}>{label}</span>
                <span style={{ fontSize: "11px", color: C.t1, fontWeight: 600 }}>{val}</span>
              </div>
              <div style={{ height: "3px", background: "rgba(15,23,42,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ width: `${val}%`, height: "100%", background: cor, borderRadius: "2px", transition: "width 0.8s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "20px", background: `${cor}10`, width: "fit-content", whiteSpace: "nowrap" }}>
        <Activity size={11} color={cor} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: "12px", color: cor, fontWeight: 700 }}>{saude?.nivel}</span>
      </div>
    </div>
  );
}

// ── KPI CARD ──────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div style={{
      background: C.card, borderRadius: C.radius, boxShadow: C.shadow,
      padding: "22px 24px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", color: C.t2, fontWeight: 600 }}>{label}</p>
        {Icon && (
          <div style={{
            width: "32px", height: "32px", borderRadius: C.radiusSm, flexShrink: 0,
            background: `${accent}12`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon size={15} color={accent} />
          </div>
        )}
      </div>
      <p style={{ fontSize: "32px", fontWeight: 800, color: C.t1, lineHeight: 1.1, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{value}</p>
      <p style={{ fontSize: "13px", color: C.t3, marginTop: "8px" }}>{sub}</p>
    </div>
  );
}

// ── PRINCIPAL CARD ────────────────────────────────────────────
function PrincipalCard({ item, atualizar }) {
  const cfg  = TYPE[item.tipo] || TYPE.alerta;
  const Icon = cfg.icon;
  const nome = item.produto_nome || item.titulo;
  const desc = cleanDescricao(item.descricao, nome, fmt(item.impacto_valor));
  return (
    <div style={{
      background: C.card, borderRadius: "20px", boxShadow: C.shadow,
      padding: "26px 28px", position: "relative", overflow: "visible",
    }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "200px", height: "200px", background: `radial-gradient(circle, ${cfg.color}08 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ display: "flex", gap: "16px", flex: 1 }}>
          <div style={{ width: "44px", height: "44px", borderRadius: C.radiusSm, flexShrink: 0, background: `${cfg.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={20} color={cfg.color} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "19px", fontWeight: 700, color: C.t1, letterSpacing: "-0.01em" }}>{nome}</span>
              <span style={{ fontSize: "12px", fontWeight: 700, padding: "3px 11px", borderRadius: "20px", background: `${cfg.color}12`, color: cfg.color }}>{cfg.label}</span>
            </div>
            <p style={{ fontSize: "15px", color: C.t2, lineHeight: 1.5 }}>{desc}</p>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontSize: "12px", color: C.t3, marginBottom: "5px", fontWeight: 600 }}>Impacto</p>
          <p style={{ fontSize: "26px", fontWeight: 800, color: C.t1, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>R$ {fmt(item.impacto_valor)}</p>
        </div>
      </div>
      {item.recomendacao?.acao && (
        <div style={{ marginTop: "18px", padding: "14px 18px", borderRadius: C.radiusSm, background: C.card2, fontSize: "14px", color: C.t2, display: "flex", alignItems: "center", gap: "10px" }}>
          <ArrowRight size={14} color={cfg.color} style={{ flexShrink: 0 }} />
          {item.recomendacao.acao}
        </div>
      )}
      <div style={{ display: "flex", gap: "8px", marginTop: "18px" }}>
        <ResolverMenu align="left" onResolver={(acao) => atualizar(item.id, "RESOLVIDO", acao)} />
        <button
          onClick={() => atualizar(item.id, "IGNORADO")}
          style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: C.red, background: "rgba(220,38,38,0.08)", border: "none", borderRadius: "20px", padding: "8px 18px", cursor: "pointer", fontFamily: "inherit" }}
        ><XCircle size={14} /> Ignorar</button>
      </div>
    </div>
  );
}

// ── DECISION ROW ──────────────────────────────────────────────
function DecisionRow({ item, atualizar, max, isFirst, isLast }) {
  const cfg  = TYPE[item.tipo] || TYPE.alerta;
  const pct  = Math.min((Number(item.impacto_valor || 0) / max) * 100, 100);
  const Icon = cfg.icon;
  const nome = item.produto_nome || item.titulo;
  const desc = truncate(cleanDescricao(item.descricao, nome, fmt(item.impacto_valor)));
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: "16px",
        padding: "16px 22px",
        borderBottom: isLast ? "none" : `1px solid ${C.border}`,
        borderTopLeftRadius: isFirst ? C.radius : 0, borderTopRightRadius: isFirst ? C.radius : 0,
        borderBottomLeftRadius: isLast ? C.radius : 0, borderBottomRightRadius: isLast ? C.radius : 0,
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = C.cardHover; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{
        width: "38px", height: "38px", borderRadius: C.radiusSm, flexShrink: 0,
        background: `${cfg.color}12`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={17} color={cfg.color} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "15px", fontWeight: 600, color: C.t1, marginBottom: "3px" }}>{nome}</p>
        <p style={{ fontSize: "13px", color: C.t3, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{desc}</p>
        <div style={{ marginTop: "9px", height: "4px", background: "rgba(15,23,42,0.06)", borderRadius: "2px", overflow: "hidden", maxWidth: "220px" }}>
          <div className="progress-bar" style={{ width: `${pct}%`, background: cfg.color }} />
        </div>
      </div>

      <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "7px" }}>
        <p style={{ fontSize: "16px", fontWeight: 700, color: C.t1, letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums" }}>R$ {fmt(item.impacto_valor)}</p>
        <div style={{ display: "flex", gap: "6px" }}>
          <ResolverMenu size="sm" onResolver={(acao) => atualizar(item.id, "RESOLVIDO", acao)} />
          <button
            onClick={() => atualizar(item.id, "IGNORADO")}
            style={{ fontSize: "12px", fontWeight: 600, color: C.red, background: "rgba(220,38,38,0.08)", border: "none", borderRadius: "20px", padding: "4px 12px", cursor: "pointer" }}
          >Ignorar</button>
        </div>
      </div>
    </div>
  );
}

function Spinner({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: C.t3, fontSize: "15px", gap: "10px" }}>
      <div style={{ width: "18px", height: "18px", border: "2px solid rgba(0,133,226,0.15)", borderTopColor: "#0085E2", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
      {label}
    </div>
  );
}
