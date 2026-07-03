import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Package, AlertCircle, CheckCircle, ShoppingCart, Search, Upload, X, ArrowRight } from "lucide-react";
import api from "../services/api";

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
  brandBdr:  "rgba(0,133,226,0.4)",
  radius:    "18px",
  radiusSm:  "12px",
  shadow:    "0 1px 2px rgba(15,23,42,0.04), 0 10px 24px rgba(15,23,42,0.06)",
};

export default function Products() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [importando, setImportando] = useState(false);
  const [resultado, setResultado]   = useState(null);
  const fileRef = useRef(null);

  async function load() {
    try { const res = await api.get("/produtos"); setProdutos(res.data || []); }
    catch {} finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleFile(e) {
    const arquivo = e.target.files?.[0];
    e.target.value = "";
    if (!arquivo) return;

    setImportando(true);
    setResultado(null);
    try {
      const formData = new FormData();
      formData.append("arquivo", arquivo);
      const res = await api.post("/produtos/importar", formData);
      let decisoesGeradas = null;

      // Dados novos entraram — roda a engine na hora pra já virar decisão,
      // sem precisar de um segundo clique em "Executar".
      if (res.data.vendas_inseridas > 0 || res.data.produtos_criados > 0) {
        try {
          const exec = await api.post("/engine/executar");
          decisoesGeradas = Array.isArray(exec.data) ? exec.data.length : null;
        } catch {}
      }

      setResultado({ ok: true, ...res.data, decisoesGeradas });
      load();
    } catch (err) {
      setResultado({ ok: false, erro: err.response?.data?.error || "Falha ao importar arquivo" });
    } finally {
      setImportando(false);
    }
  }

  if (loading) return <Spinner />;

  const total        = produtos.length;
  const estoqueTotal = produtos.reduce((a, p) => a + Number(p.estoque || 0), 0);
  const criticos     = produtos.filter((p) => Number(p.estoque) <= Number(p.minimo || 0));
  const normais      = produtos.filter((p) => Number(p.estoque) > Number(p.minimo || 0));
  const filtered     = produtos.filter((p) => !search || p.nome?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px", animation: "fade-in-up 0.35s ease-out" }}>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
        {[
          { icon: Package,      label: "Total",    value: total,           accent: C.brand },
          { icon: ShoppingCart, label: "Estoque",  value: estoqueTotal,    accent: C.brand },
          { icon: CheckCircle,  label: "Normais",  value: normais.length,  accent: C.green },
          { icon: AlertCircle,  label: "Críticos", value: criticos.length, accent: C.red   },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} style={{ background: C.card, borderRadius: C.radius, boxShadow: C.shadow, padding: "22px 24px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                <p style={{ fontSize: "13px", color: C.t2, fontWeight: 600 }}>{k.label}</p>
                <div style={{ width: "32px", height: "32px", borderRadius: C.radiusSm, flexShrink: 0, background: `${k.accent}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={15} color={k.accent} />
                </div>
              </div>
              <p style={{ fontSize: "32px", fontWeight: 800, color: C.t1, lineHeight: 1.1, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{k.value}</p>
            </div>
          );
        })}
      </div>

      {/* CRITICAL ALERT */}
      {criticos.length > 0 && (
        <div style={{ background: "rgba(220,38,38,0.06)", borderRadius: C.radiusSm, padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: C.red, boxShadow: "0 0 8px rgba(220,38,38,0.5)", flexShrink: 0, animation: "pulse-red 1.8s ease-in-out infinite" }} />
          <span style={{ fontSize: "14px", fontWeight: 600, color: C.red }}>{criticos.length} produto{criticos.length > 1 ? "s" : ""} com estoque crítico</span>
          <span style={{ fontSize: "13px", color: C.t3 }}>— reposição recomendada imediatamente</span>
        </div>
      )}

      {/* SEARCH + IMPORTAR */}
      <div style={{ display: "flex", gap: "12px" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={15} strokeWidth={2} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: C.t4, pointerEvents: "none" }} />
          <input
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "11px 16px 11px 40px", borderRadius: C.radiusSm, background: C.card, border: `1px solid ${C.border}`, boxShadow: C.shadow, color: C.t1, fontSize: "14px", outline: "none", fontFamily: "inherit", transition: "border-color 0.2s", boxSizing: "border-box" }}
            onFocus={(e) => (e.target.style.borderColor = C.brandBdr)}
            onBlur={(e)  => (e.target.style.borderColor = C.border)}
          />
        </div>

        <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv,.txt" onChange={handleFile} style={{ display: "none" }} />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={importando}
          style={{
            display: "flex", alignItems: "center", gap: "8px", flexShrink: 0,
            padding: "0 20px", borderRadius: C.radiusSm, fontSize: "14px", fontWeight: 600,
            background: "rgba(0,133,226,0.1)", border: "none",
            color: C.brand, cursor: importando ? "not-allowed" : "pointer", fontFamily: "inherit",
            opacity: importando ? 0.6 : 1,
          }}
        >
          <Upload size={15} />
          {importando ? "Importando..." : "Importar relatório"}
        </button>
      </div>

      {/* RESULTADO DA IMPORTAÇÃO */}
      {resultado && (
        <div style={{
          background: resultado.ok ? "rgba(4,120,87,0.06)" : "rgba(220,38,38,0.06)",
          borderRadius: C.radiusSm, padding: "14px 18px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
        }}>
          {resultado.ok ? (
            <span style={{ fontSize: "13px", color: C.green, fontWeight: 500 }}>
              <strong>{resultado.vendas_inseridas}</strong> venda(s) importada(s) · <strong>{resultado.produtos_criados}</strong> produto(s) novo(s) · <strong>{resultado.produtos_atualizados}</strong> estoque(s) atualizado(s)
              {resultado.erros?.length > 0 && ` · ${resultado.erros.length} linha(s) com erro`}
              {resultado.decisoesGeradas !== null && ` · engine rodou: ${resultado.decisoesGeradas} decisão(ões) gerada(s)`}
            </span>
          ) : (
            <span style={{ fontSize: "13px", color: C.red, fontWeight: 500 }}>{resultado.erro}</span>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            {resultado.ok && resultado.decisoesGeradas > 0 && (
              <button
                onClick={() => navigate("/decisions")}
                style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: 600, color: C.green, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}
              >
                Ver decisões <ArrowRight size={12} />
              </button>
            )}
            <button onClick={() => setResultado(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.t4, display: "flex" }}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* GRID */}
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: C.t1, marginBottom: "12px", letterSpacing: "-0.01em" }}>Inventário ({filtered.length})</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "14px" }}>
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "50px", color: C.t3, background: C.card, borderRadius: C.radius, boxShadow: C.shadow, fontSize: "14px" }}>Nenhum produto encontrado</div>
          )}
          {filtered.map((p) => {
            const isCrit = Number(p.estoque) <= Number(p.minimo || 0);
            const minVal = Math.max(Number(p.minimo || 1) * 2, 1);
            const pct    = Math.min((Number(p.estoque) / minVal) * 100, 100);
            const cor    = isCrit ? C.red : C.green;
            const bar    = isCrit ? C.red : pct > 60 ? C.green : C.amber;

            return (
              <div key={p.id}
                style={{ background: C.card, borderRadius: C.radius, boxShadow: C.shadow, padding: "18px", transition: "transform 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = C.cardHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.card; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: C.radiusSm, flexShrink: 0, background: `${cor}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Package size={17} color={cor} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: C.t1, lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.nome}</p>
                    <span style={{ fontSize: "11px", fontWeight: 700, padding: "1px 8px", borderRadius: "20px", background: `${cor}12`, color: cor }}>{isCrit ? "Crítico" : "Normal"}</span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                  {[
                    { label: "Estoque", value: p.estoque,     color: isCrit ? C.red : C.t1 },
                    { label: "Mínimo",  value: p.minimo || 0, color: C.t3                   },
                  ].map((s) => (
                    <div key={s.label} style={{ padding: "8px 11px", borderRadius: C.radiusSm, background: C.card2 }}>
                      <p style={{ fontSize: "10px", color: C.t3, marginBottom: "2px" }}>{s.label}</p>
                      <p style={{ fontSize: "17px", fontWeight: 700, color: s.color, letterSpacing: "-0.01em" }}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ height: "4px", background: "rgba(15,23,42,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                  <div className="progress-bar" style={{ width: `${pct}%`, background: bar }} />
                </div>
                <p style={{ fontSize: "11px", color: C.t4, marginTop: "5px", textAlign: "right", fontWeight: 600 }}>{Math.round(pct)}%</p>
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
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh", color: C.t3, fontSize: "15px", gap: "10px" }}>
      <div style={{ width: "18px", height: "18px", border: "2px solid rgba(0,133,226,0.15)", borderTopColor: "#0085E2", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
      Carregando inventário...
    </div>
  );
}
