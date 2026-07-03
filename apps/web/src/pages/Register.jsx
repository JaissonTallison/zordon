import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import api from "../services/api";
import AuthCarouselPanel from "../components/auth/AuthCarouselPanel";

// ── Palette de Cores (Tema Claro / Clear) — mesma do Login ──
const card = "#FFFFFF"; // Fundo dos cards e painel direito (Branco puro)
const bdr  = "rgba(0, 0, 0, 0.08)"; // Bordas sutis escuras
const br   = "#0085E2"; // Azul institucional
const t1   = "#0F172A"; // Texto principal (Slate 900)
const t2   = "#475569"; // Texto secundário (Slate 600)
const t3   = "#64748B"; // Texto terciário / legendas (Slate 500)

const gradientText = {
  backgroundImage: "linear-gradient(135deg, #38BDFF, #7DD3FC)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const SLIDES = [
  {
    src: "/background00.jpg",
    heading: <>Comece a{" "}<span style={gradientText}>tomar decisões inteligentes</span>{" "}hoje mesmo</>,
    text: "Configure sua empresa e deixe o ZORDON identificar problemas, calcular impactos e recomendar ações — automaticamente.",
    features: [
      "Engine de inferência por regras determinísticas",
      "Cálculo automático de impacto financeiro",
      "Priorização inteligente de decisões",
      "Multi-tenant e pronto para escalar",
    ],
  },
  {
    src: "/background01.jpg",
    heading: <>Sua operação,{" "}<span style={gradientText}>monitorada 24/7</span></>,
    text: "Da criação da conta ao primeiro alerta — em minutos, não semanas.",
  },
];

const FIELDS = [
  { name: "nome",         label: "Nome completo",  type: "text",     placeholder: "João Silva"         },
  { name: "email",        label: "Email",          type: "email",    placeholder: "joao@empresa.com"   },
  { name: "senha",        label: "Senha",          type: "password", placeholder: "••••••••"           },
  { name: "empresa_nome", label: "Nome da empresa", type: "text",    placeholder: "Minha Empresa LTDA" },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ nome: "", email: "", senha: "", empresa_nome: "" });
  const [loading, setLoading] = useState(false);
  const [erro, setErro]       = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setErro("");
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setErro(err.response?.data?.erro || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: card, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <AuthCarouselPanel slides={SLIDES} />

      {/* ── RIGHT PANEL (Formulário de Cadastro com Fundo Clear) ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 32px", background: card }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>

          {/* LOGO MOBILE / TELAS PEQUENAS */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
            <img
              src="/logo.png"
              alt="ZORDON"
              style={{ width: "56px", height: "56px", borderRadius: "12px", objectFit: "contain", filter: "drop-shadow(0 4px 12px rgba(0,0,133,0.08))" }}
            />
            <span style={{ fontSize: "20px", fontWeight: 800, color: t1, letterSpacing: "0.06em" }}>ZORDON</span>
          </div>

          <div style={{ marginBottom: "28px", textAlign: "center" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: t1, letterSpacing: "-0.01em" }}>Criar conta</h2>
            <p style={{ fontSize: "13px", color: t3, marginTop: "4px" }}>Configure seu ambiente operacional</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {FIELDS.map((f) => (
              <div key={f.name}>
                <label style={{ display: "block", fontSize: "11px", color: t2, marginBottom: "6px", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
                  {f.label}
                </label>
                <input
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: "8px",
                    background: "#FFFFFF", border: `1px solid ${bdr}`,
                    color: t1, fontSize: "14px", outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s", fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(0,133,226,0.5)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(0,133,226,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = bdr;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            ))}

            {erro && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "8px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444", fontSize: "13px" }}>
                <AlertCircle size={15} strokeWidth={2} style={{ flexShrink: 0 }} />
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "11px 20px", borderRadius: "8px",
                background: loading ? "#E2E8F0" : "linear-gradient(135deg, #005499, #0085E2)",
                border: "none", color: loading ? t3 : "#fff",
                fontSize: "14px", fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s", fontFamily: "inherit", marginTop: "4px",
                boxShadow: loading ? "none" : "0 4px 16px rgba(0,133,226,0.2)",
              }}
            >
              {loading ? "Criando ambiente..." : "Criar conta e entrar"}
            </button>
          </form>

          <div style={{ marginTop: "20px", textAlign: "center", fontSize: "13px", color: t3 }}>
            Já tem conta?{" "}
            <Link to="/login" style={{ color: br, textDecoration: "none", fontWeight: 500 }}>Entrar</Link>
          </div>

          <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: `1px solid ${bdr}`, textAlign: "center", fontSize: "11px", color: t3 }}>
            © 2026 ZORDON Intelligence · Todos os direitos reservados
          </div>
        </div>
      </div>
    </div>
  );
}
