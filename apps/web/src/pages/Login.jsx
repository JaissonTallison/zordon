import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import AuthCarouselPanel from "../components/auth/AuthCarouselPanel";

// ── Palette de Cores (Tema Claro / Clear) ──
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
    heading: <>Dados operacionais{" "}<span style={gradientText}>transformados em decisões</span></>,
    text: "Identifique problemas, calcule impacto financeiro e priorize ações — automaticamente.",
  },
  {
    src: "/background01.jpg",
    heading: <>Inteligência que age{" "}<span style={gradientText}>antes do problema crescer</span></>,
    text: "Monitoramento contínuo, alertas em tempo real e decisões priorizadas por impacto.",
  },
];

export default function Login() {
  const { login }   = useAuthStore();
  const navigate    = useNavigate();
  const [email, setEmail]     = useState("");
  const [senha, setSenha]     = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro]       = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); setErro("");
      await login(email, senha);
      navigate("/");
    } catch { setErro("Credenciais inválidas"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: card, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <AuthCarouselPanel slides={SLIDES} />

      {/* ── RIGHT PANEL (Formulário de Login com Fundo Clear) ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 32px", background: card }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>

          {/* LOGO MOBILE / TELAS PEQUENAS (Corrigido para garantir visibilidade e alinhamento) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
            <img 
              src="/logo.png" 
              alt="ZORDON" 
              style={{ width: "56px", height: "56px", borderRadius: "12px", objectFit: "contain", filter: "drop-shadow(0 4px 12px rgba(0,0,133,0.08))" }} 
            />
            <span style={{ fontSize: "20px", fontWeight: 800, color: t1, letterSpacing: "0.06em" }}>ZORDON</span>
          </div>

          <div style={{ marginBottom: "28px", textAlign: "center" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: t1, letterSpacing: "-0.01em" }}>Acessar plataforma</h2>
            <p style={{ fontSize: "13px", color: t3, marginTop: "4px" }}>Entre com suas credenciais para continuar</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { label: "Email", type: "email",    value: email, set: setEmail, ph: "seu@email.com" },
              { label: "Senha", type: "password", value: senha, set: setSenha, ph: "••••••••"      },
            ].map((f) => (
              <div key={f.label}>
                <label style={{ display: "block", fontSize: "11px", color: t2, marginBottom: "6px", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
                  {f.label}
                </label>
                <input
                  type={f.type} placeholder={f.ph} value={f.value}
                  onChange={(e) => f.set(e.target.value)} required
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: "8px",
                    background: "#FFFFFF", border: `1px solid ${bdr}`,
                    color: t1, fontSize: "14px", outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s", fontFamily: "inherit",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(0,133,226,0.5)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(0,133,226,0.1)";
                  }}
                  onBlur={(e)  => {
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
              type="submit" disabled={loading}
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
              {loading ? "Autenticando..." : "Entrar no sistema"}
            </button>
          </form>

          <div style={{ marginTop: "20px", textAlign: "center", fontSize: "13px", color: t3 }}>
            Novo por aqui?{" "}
            <Link to="/register" style={{ color: br, textDecoration: "none", fontWeight: 500 }}>Criar conta</Link>
          </div>

          <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: `1px solid ${bdr}`, textAlign: "center", fontSize: "11px", color: t3 }}>
            © 2026 ZORDON Intelligence · Todos os direitos reservados
          </div>
        </div>
      </div>
    </div>
  );
}