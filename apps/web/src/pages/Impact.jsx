import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
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
  red:       "#DC2626",
  amber:     "#B45309",
  green:     "#047857",
  brand:     "#0085E2",
  radius:    "18px",
  radiusSm:  "12px",
  shadow:    "0 1px 2px rgba(15,23,42,0.04), 0 10px 24px rgba(15,23,42,0.06)",
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

  const porCategoria = Object.values(
    data.reduce((acc, d) => {
      const cfg = getCfg(d.codigo);
      if (!acc[cfg.label]) acc[cfg.label] = { label: cfg.label, color: cfg.color, valor: 0 };
      acc[cfg.label].valor += d.impacto_valor;
      return acc;
    }, {})
  ).sort((a, b) => b.valor - a.valor);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px", animation: "fade-in-up 0.35s ease-out" }}>

      {/* HERO */}
      <div style={{ background: C.card, borderRadius: "20px", boxShadow: C.shadow, padding: "30px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(251,191,36,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: C.radiusSm, background: "rgba(180,83,9,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <DollarSign size={14} color={C.amber} />
              </div>
              <span style={{ fontSize: "14px", color: C.t2, fontWeight: 600 }}>Impacto total identificado</span>
            </div>
            <p style={{ fontSize: "clamp(30px,4vw,46px)", fontWeight: 800, color: C.t1, lineHeight: 1, letterSpacing: "-0.03em" }}>
              R$ {fmt(total)}
            </p>
            <p style={{ fontSize: "13px", color: C.t3, marginTop: "10px" }}>{data.length} registros processados</p>
          </div>
          <div style={{ display: "flex", gap: "14px" }}>
            {[
              { icon: TrendingDown, label: "Perdas", value: perdas, color: C.red   },
              { icon: TrendingUp,   label: "Ganhos", value: ganhos, color: C.green },
            ].map((k) => {
              const Icon = k.icon;
              return (
                <div key={k.label} style={{ padding: "14px 20px", borderRadius: C.radiusSm, background: `${k.color}0D` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <Icon size={12} color={k.color} />
                    <span style={{ fontSize: "12px", color: k.color, fontWeight: 600 }}>{k.label}</span>
                  </div>
                  <p style={{ fontSize: "19px", fontWeight: 700, color: k.color, letterSpacing: "-0.01em" }}>R$ {fmt(k.value)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DISTRIBUIÇÃO POR CATEGORIA */}
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: C.t1, marginBottom: "12px", letterSpacing: "-0.01em" }}>Distribuição por categoria</h3>
        <div style={{ background: C.card, borderRadius: C.radius, boxShadow: C.shadow, padding: "20px 26px 12px" }}>
          {porCategoria.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: C.t3, fontSize: "14px" }}>Nenhum registro</div>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(porCategoria.length * 56, 120)}>
              <BarChart data={porCategoria} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 4 }}>
                <XAxis type="number" tick={{ fontSize: 12, fill: C.t3 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$ ${fmt(v)}`} />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 13, fill: C.t1, fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip
                  cursor={{ fill: "rgba(15,23,42,0.03)" }}
                  formatter={(v) => [`R$ ${fmt(v)}`, "Impacto"]}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: C.shadow, fontSize: "13px" }}
                />
                <Bar dataKey="valor" radius={[0, 8, 8, 0]} barSize={26}>
                  {porCategoria.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: C.t1, marginBottom: "12px", letterSpacing: "-0.01em" }}>Todos os registros</h3>
        <div style={{ background: C.card, borderRadius: C.radius, boxShadow: C.shadow, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 140px", padding: "12px 22px", borderBottom: `1px solid ${C.border}`, fontSize: "12px", color: C.t3, fontWeight: 600 }}>
            <span>Produto / Código</span><span style={{ textAlign: "center" }}>Tipo</span><span style={{ textAlign: "right" }}>Impacto</span>
          </div>
          {data.map((d, i) => {
            const cfg = getCfg(d.codigo);
            return (
              <div key={d.id} style={{ display: "grid", gridTemplateColumns: "1fr 110px 140px", padding: "13px 22px", alignItems: "center", borderBottom: i < data.length - 1 ? `1px solid ${C.border}` : "none", transition: "background 0.12s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.cardHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontSize: "14px", color: C.t2 }}>{d.produto_nome || d.codigo}</span>
                <span style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 9px", borderRadius: "20px", background: `${cfg.color}12`, color: cfg.color }}>{cfg.label}</span>
                </span>
                <span style={{ textAlign: "right", fontSize: "14px", fontWeight: 700, color: C.t1 }}>R$ {fmt(d.impacto_valor)}</span>
              </div>
            );
          })}
          {data.length === 0 && <div style={{ padding: "50px", textAlign: "center", color: C.t3, fontSize: "14px" }}>Nenhum registro</div>}
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh", color: C.t3, fontSize: "15px", gap: "10px" }}>
      <div style={{ width: "18px", height: "18px", border: "2px solid rgba(0,133,226,0.15)", borderTopColor: "#0085E2", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
      Calculando impacto financeiro...
    </div>
  );
}
