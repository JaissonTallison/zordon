import { useEffect, useState } from "react";
import { Cpu, Plus, ToggleLeft, ToggleRight, Trash2, Edit3, ChevronDown, ChevronUp, X } from "lucide-react";
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
  brandLt:   "#38BDFF",
  brandBg:   "rgba(0,133,226,0.1)",
  brandBdr:  "rgba(0,133,226,0.3)",
  radius:    "18px",
  radiusSm:  "12px",
  shadow:    "0 1px 2px rgba(15,23,42,0.04), 0 10px 24px rgba(15,23,42,0.06)",
};

const TIPO_CFG = {
  problema:     { color: C.red,    label: "Problema"     },
  alerta:       { color: C.amber,  label: "Alerta"       },
  oportunidade: { color: C.green,  label: "Oportunidade" },
  previsao:     { color: C.brand,  label: "Previsão"     },
};

const PRI_CFG = {
  CRITICA: { color: C.red,   label: "Crítica" },
  ALTA:    { color: C.amber, label: "Alta"    },
  MEDIA:   { color: C.brand, label: "Média"   },
  BAIXA:   { color: C.t3,    label: "Baixa"   },
};

const EMPTY_FORM = {
  nome: "", codigo: "", tipo: "problema", prioridade: "MEDIA", escopo: "produto",
  ativa: true, peso: 1.0, impacto_formula: "", titulo_template: "",
  descricao_template: "", recomendacao_template: "",
  condicoes: { operador: "AND", condicoes: [] },
};

export default function Rules() {
  const [regras,   setRegras]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [editando, setEditando] = useState(null);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [expanded, setExpanded] = useState({});
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    try { const res = await api.get("/regras"); setRegras(res.data || []); }
    catch { setRegras([]); }
    finally { setLoading(false); }
  }

  useEffect(() => { carregar(); }, []);

  function abrirNova() { setEditando(null); setForm(EMPTY_FORM); setModal(true); }

  function abrirEditar(r) {
    setEditando(r.id);
    setForm({
      nome: r.nome, codigo: r.codigo, tipo: r.tipo, prioridade: r.prioridade,
      escopo: r.escopo || "produto", ativa: r.ativa, peso: r.peso,
      impacto_formula: r.impacto_formula || "",
      titulo_template: r.titulo_template || "",
      descricao_template: r.descricao_template || "",
      recomendacao_template: r.recomendacao_template || "",
      condicoes: typeof r.condicoes === "string" ? JSON.parse(r.condicoes) : r.condicoes,
    });
    setModal(true);
  }

  async function salvar() {
    setSalvando(true);
    try {
      if (editando) await api.put(`/regras/${editando}`, form);
      else          await api.post("/regras", form);
      setModal(false);
      carregar();
    } catch (e) {
      alert("Erro ao salvar regra: " + (e.response?.data?.erro || e.message));
    } finally {
      setSalvando(false);
    }
  }

  async function togglear(id) {
    try { await api.patch(`/regras/${id}/toggle`); carregar(); } catch {}
  }

  async function deletar(id) {
    if (!confirm("Deletar esta regra?")) return;
    try { await api.delete(`/regras/${id}`); carregar(); } catch {}
  }

  function toggleExpand(id) { setExpanded((p) => ({ ...p, [id]: !p[id] })); }

  if (loading) return <Spinner />;

  const ativas   = regras.filter((r) => r.ativa).length;
  const inativas = regras.filter((r) => !r.ativa).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px", animation: "fade-in-up 0.35s ease-out" }}>

      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: C.radiusSm, background: C.brandBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Cpu size={15} color={C.brand} />
            </div>
            <span style={{ fontSize: "16px", fontWeight: 700, color: C.t1 }}>Regras dinâmicas</span>
            <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 9px", borderRadius: "20px", background: C.brandBg, color: C.brand }}>{regras.length} total</span>
          </div>
          <p style={{ fontSize: "13px", color: C.t3 }}>
            {ativas} ativas · {inativas} inativas — mudanças entram em vigor na próxima execução
          </p>
        </div>
        <button onClick={abrirNova} style={{
          display: "flex", alignItems: "center", gap: "7px",
          padding: "10px 20px", borderRadius: "20px", fontSize: "13px",
          background: C.brandBg, border: "none",
          color: C.brand, cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
          transition: "all 0.15s",
        }}>
          <Plus size={14} /> Nova regra
        </button>
      </div>

      {/* LISTA */}
      {regras.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: C.t3, background: C.card, borderRadius: C.radius, boxShadow: C.shadow, fontSize: "14px" }}>
          Nenhuma regra cadastrada. Crie sua primeira regra.
        </div>
      ) : (
        <div style={{ background: C.card, borderRadius: C.radius, boxShadow: C.shadow, overflow: "hidden" }}>
          {regras.map((r, i) => {
            const tc  = TIPO_CFG[r.tipo] || TIPO_CFG.problema;
            const pc  = PRI_CFG[r.prioridade] || PRI_CFG.MEDIA;
            const exp = expanded[r.id];

            return (
              <div key={r.id} style={{
                borderBottom: i === regras.length - 1 && !exp ? "none" : `1px solid ${C.border}`,
                opacity: r.ativa ? 1 : 0.55, transition: "all 0.15s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 22px" }}
                  onMouseEnter={(e) => { e.currentTarget.parentElement.style.background = C.cardHover; }}
                  onMouseLeave={(e) => { e.currentTarget.parentElement.style.background = "transparent"; }}
                >
                  <button onClick={() => togglear(r.id)} style={{ background: "none", border: "none", cursor: "pointer", color: r.ativa ? C.green : C.t4, flexShrink: 0, display: "flex" }}>
                    {r.ativa ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: C.t1 }}>{r.nome}</span>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 9px", borderRadius: "20px", background: `${tc.color}12`, color: tc.color }}>{tc.label}</span>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 9px", borderRadius: "20px", background: `${pc.color}12`, color: pc.color }}>{pc.label}</span>
                      <span style={{ fontSize: "12px", color: C.t4, fontFamily: "'JetBrains Mono',monospace" }}>{r.codigo}</span>
                    </div>
                    {r.descricao_template && (
                      <p style={{ fontSize: "13px", color: C.t3, marginTop: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.descricao_template}
                      </p>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                    <button onClick={() => toggleExpand(r.id)} title="Ver condições" style={{ background: "none", border: "none", cursor: "pointer", color: C.t4, padding: "6px", display: "flex" }}>
                      {exp ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                    <button onClick={() => abrirEditar(r)} title="Editar" style={{ background: "none", border: "none", cursor: "pointer", color: C.brand, padding: "6px", display: "flex" }}>
                      <Edit3 size={15} />
                    </button>
                    <button onClick={() => deletar(r.id)} title="Deletar" style={{ background: "none", border: "none", cursor: "pointer", color: C.red, padding: "6px", display: "flex" }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {exp && (
                  <div style={{ padding: "0 22px 18px 22px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "4px" }}>
                      <InfoBlock label="Fórmula de impacto" value={r.impacto_formula || "—"} mono />
                      <InfoBlock label="Peso da regra"      value={r.peso}          mono />
                      <InfoBlock label="Template de título" value={r.titulo_template || "—"} />
                      <InfoBlock label="Recomendação"       value={r.recomendacao_template || "—"} />
                    </div>
                    <div style={{ marginTop: "12px" }}>
                      <p style={{ fontSize: "12px", color: C.t3, fontWeight: 600, marginBottom: "6px" }}>Condições (JSON)</p>
                      <pre style={{
                        fontSize: "12px", color: C.brand,
                        background: C.card2,
                        borderRadius: C.radiusSm, padding: "12px 14px", overflow: "auto",
                        fontFamily: "'JetBrains Mono',monospace", margin: 0, maxHeight: "140px",
                      }}>
                        {JSON.stringify(
                          typeof r.condicoes === "string" ? JSON.parse(r.condicoes) : r.condicoes,
                          null, 2
                        )}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <RuleModal
          form={form}
          setForm={setForm}
          salvando={salvando}
          editando={editando}
          onSave={salvar}
          onClose={() => setModal(false)}
        />
      )}
    </div>
  );
}

// ── Auxiliares ────────────────────────────────────────────────
function InfoBlock({ label, value, mono }) {
  return (
    <div>
      <p style={{ fontSize: "11px", color: C.t3, marginBottom: "4px" }}>{label}</p>
      <p style={{ fontSize: "13px", color: C.t2, fontFamily: mono ? "'JetBrains Mono',monospace" : "inherit" }}>{value}</p>
    </div>
  );
}

function RuleModal({ form, setForm, salvando, editando, onSave, onClose }) {
  const [jsonError, setJsonError] = useState("");

  function f(field) { return (e) => setForm((p) => ({ ...p, [field]: e.target.value })); }

  function handleCondicoes(e) {
    try {
      const parsed = JSON.parse(e.target.value);
      setForm((p) => ({ ...p, condicoes: parsed }));
      setJsonError("");
    } catch { setJsonError("JSON inválido"); }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#FFFFFF",
        borderRadius: "20px", padding: "28px 30px",
        width: "100%", maxWidth: "660px",
        maxHeight: "90vh", overflowY: "auto",
        display: "flex", flexDirection: "column", gap: "18px",
        boxShadow: "0 20px 60px rgba(15,23,42,0.25)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: C.t1, letterSpacing: "-0.01em" }}>
            {editando ? "Editar regra" : "Nova regra"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.t4, cursor: "pointer", display: "flex", padding: 0 }}><X size={20} strokeWidth={2} /></button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <MField label="Nome"   value={form.nome}   onChange={f("nome")}   placeholder="Ex: Produto Parado" />
          <MField label="Código" value={form.codigo} onChange={f("codigo")} placeholder="Ex: PRODUTO_PARADO_DB" mono />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "14px" }}>
          <MSelect label="Tipo"       value={form.tipo}       onChange={f("tipo")}       options={["problema","alerta","oportunidade","previsao"]} />
          <MSelect label="Prioridade" value={form.prioridade} onChange={f("prioridade")} options={["CRITICA","ALTA","MEDIA","BAIXA"]} />
          <MSelect label="Escopo"     value={form.escopo}     onChange={f("escopo")}     options={["produto","venda","global"]} />
          <MField  label="Peso"       value={form.peso}       onChange={f("peso")}       placeholder="1.0" />
        </div>

        <MField label="Fórmula de impacto" value={form.impacto_formula} onChange={f("impacto_formula")} placeholder="valor * estoque" mono />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <MField label="Template de título"    value={form.titulo_template}    onChange={f("titulo_template")}    placeholder="{nome} parado há {diasSemVenda} dias" />
          <MField label="Template de descrição" value={form.descricao_template} onChange={f("descricao_template")} placeholder="{nome} com R$ {impacto_valor} em risco" />
        </div>

        <MField label="Recomendação" value={form.recomendacao_template} onChange={f("recomendacao_template")} placeholder="Ação recomendada para o usuário" />

        <div>
          <label style={{ fontSize: "12px", color: C.t3, fontWeight: 600, display: "block", marginBottom: "7px" }}>
            Condições (JSON)
            {jsonError && <span style={{ color: C.red, marginLeft: "8px" }}>{jsonError}</span>}
          </label>
          <textarea
            defaultValue={JSON.stringify(form.condicoes, null, 2)}
            onChange={handleCondicoes}
            rows={7}
            style={{
              width: "100%", borderRadius: C.radiusSm,
              background: C.card2, border: `1px solid ${jsonError ? C.red : C.border}`,
              color: C.brand, fontSize: "13px",
              fontFamily: "'JetBrains Mono',monospace",
              padding: "12px 14px", outline: "none", resize: "vertical", boxSizing: "border-box",
            }}
          />
          <p style={{ fontSize: "12px", color: C.t3, marginTop: "6px" }}>
            Campos: <span style={{ color: C.brand, fontWeight: 600 }}>diasSemVenda, estoque, minimo, valor, mediaVendas30d, mediaVendas90d, variacao, qtd30d, qtd90d</span>
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
          <button onClick={onClose} style={{
            padding: "10px 20px", borderRadius: "20px", fontSize: "13px", fontWeight: 600,
            background: C.card2, border: "none",
            color: C.t3, cursor: "pointer", fontFamily: "inherit",
          }}>Cancelar</button>
          <button onClick={onSave} disabled={salvando || !!jsonError} style={{
            padding: "10px 22px", borderRadius: "20px", fontSize: "13px",
            background: C.brandBg, border: "none",
            color: salvando ? C.t4 : C.brand,
            cursor: salvando || jsonError ? "not-allowed" : "pointer",
            fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s",
          }}>
            {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Criar regra"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MField({ label, value, onChange, placeholder, mono }) {
  return (
    <div>
      <label style={{ fontSize: "12px", color: C.t3, fontWeight: 600, display: "block", marginBottom: "6px" }}>{label}</label>
      <input
        value={value} onChange={onChange} placeholder={placeholder}
        style={{
          width: "100%", padding: "10px 14px", borderRadius: C.radiusSm,
          background: C.card2, border: `1px solid ${C.border}`,
          color: mono ? C.brand : C.t1, fontSize: "13px",
          fontFamily: mono ? "'JetBrains Mono',monospace" : "inherit",
          outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "rgba(0,133,226,0.4)")}
        onBlur={(e)  => (e.target.style.borderColor = C.border)}
      />
    </div>
  );
}

function MSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label style={{ fontSize: "12px", color: C.t3, fontWeight: 600, display: "block", marginBottom: "6px" }}>{label}</label>
      <select value={value} onChange={onChange} style={{
        width: "100%", padding: "10px 14px", borderRadius: C.radiusSm,
        background: C.card2, border: `1px solid ${C.border}`,
        color: C.t1, fontSize: "13px", fontFamily: "inherit",
        outline: "none", cursor: "pointer", boxSizing: "border-box",
      }}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh", color: C.t3, fontSize: "15px", gap: "10px" }}>
      <div style={{ width: "18px", height: "18px", border: "2px solid rgba(0,133,226,0.15)", borderTopColor: "#0085E2", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
      Carregando regras...
    </div>
  );
}
