import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const BOOT_LINES = [
  "Inicializando ZORDON v2.0...",
  "Conectando ao motor de inferência...",
  "Carregando regras operacionais...",
  "Engine de decisão: ATIVA",
  "Sistema pronto.",
];

// ── Palette ──
const bg   = "#080A13";
const card = "#0B0E17";
const bdr  = "rgba(255,255,255,0.07)";
const br   = "#0085E2";
const brLt = "#38BDFF";
const t1   = "#F0F4FF";
const t2   = "#9BA8C0";
const t3   = "#5A6480";

export default function Login() {
  const { login }   = useAuthStore();
  const navigate    = useNavigate();
  const [email, setEmail]     = useState("");
  const [senha, setSenha]     = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro]       = useState("");
  const [bootLines, setBootLines] = useState([]);
  const [bootDone, setBootDone]   = useState(false);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < BOOT_LINES.length) { setBootLines((p) => [...p, BOOT_LINES[i]]); i++; }
      else { setBootDone(true); clearInterval(iv); }
    }, 420);
    return () => clearInterval(iv);
  }, []);

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
    <div style={{ minHeight: "100vh", display: "flex", background: card, fontFamily: "'Inter', sans-serif" }}>

      {/* ── LEFT PANEL ── */}
      <div style={{
        width: "46%", display: "none", flexDirection: "column", justifyContent: "space-between",
        background: bg, borderRight: `1px solid ${bdr}`, padding: "48px",
        position: "relative", overflow: "hidden",
      }}
        className="hidden md:flex"
      >
        {/* grid bg */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "26px 26px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(0,133,226,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* LOGO */}
        <div className="relative" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src="/logo.png" alt="ZORDON" style={{ width: "44px", height: "44px", borderRadius: "12px", objectFit: "contain", filter: "drop-shadow(0 0 10px rgba(0,133,226,0.3))" }} />
          <div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: t1, letterSpacing: "0.06em" }}>ZORDON</div>
            <div style={{ fontSize: "10px", color: t3, letterSpacing: "0.1em", textTransform: "uppercase" }}>Intelligence Platform</div>
          </div>
        </div>

        {/* HEADLINE */}
        <div className="relative" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "4px 10px", borderRadius: "20px",
            background: "rgba(0,133,226,0.08)", border: "1px solid rgba(0,133,226,0.2)",
            fontSize: "11px", color: br, letterSpacing: "0.08em", textTransform: "uppercase", width: "fit-content",
          }}>
            <span className="status-dot status-dot-active" style={{ width: "6px", height: "6px" }} />
            Motor ativo
          </div>
          <h2 style={{ fontSize: "clamp(22px,2.5vw,30px)", fontWeight: 700, color: t1, lineHeight: 1.25, letterSpacing: "-0.02em" }}>
            Dados operacionais{" "}
            <span style={{ background: `linear-gradient(135deg, ${brLt}, ${br})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              transformados em decisões
            </span>
          </h2>
          <p style={{ fontSize: "14px", color: t3, lineHeight: 1.6 }}>
            Identifique problemas, calcule impacto financeiro e priorize ações — automaticamente.
          </p>
        </div>

        {/* BOOT TERMINAL */}
        <div style={{ padding: "16px 20px", borderRadius: "10px", background: "rgba(0,0,0,0.4)", border: `1px solid ${bdr}`, fontFamily: "'JetBrains Mono', monospace" }}>
          <div style={{ fontSize: "10px", color: t3, marginBottom: "8px", letterSpacing: "0.05em" }}>▸ zordon.boot</div>
          {bootLines.map((line, i) => (
            <div key={i} style={{ fontSize: "11px", color: i === bootLines.length - 1 && bootDone ? "#34D399" : t3, lineHeight: 1.8 }}>
              <span style={{ color: bdr }}>{">"}</span> {line}
            </div>
          ))}
          {bootDone && <div style={{ fontSize: "11px", color: br, marginTop: "4px" }}><span style={{ color: bdr }}>{">"}</span> <span className="cursor">_</span></div>}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 32px" }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>

          {/* Mobile logo */}
          <div className="flex md:hidden" style={{ alignItems: "center", gap: "8px", marginBottom: "32px" }}>
            <img src="/logo.png" alt="ZORDON" style={{ width: "36px", height: "36px", borderRadius: "9px", objectFit: "contain" }} />
            <span style={{ fontSize: "16px", fontWeight: 700, color: t1, letterSpacing: "0.06em" }}>ZORDON</span>
          </div>

          <div style={{ marginBottom: "28px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: t1, letterSpacing: "-0.01em" }}>Acessar plataforma</h2>
            <p style={{ fontSize: "13px", color: t3, marginTop: "4px" }}>Entre com suas credenciais para continuar</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { label: "Email", type: "email",    value: email, set: setEmail, ph: "seu@email.com" },
              { label: "Senha", type: "password", value: senha, set: setSenha, ph: "••••••••"      },
            ].map((f) => (
              <div key={f.label}>
                <label style={{ display: "block", fontSize: "11px", color: t2, marginBottom: "6px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {f.label}
                </label>
                <input
                  type={f.type} placeholder={f.ph} value={f.value}
                  onChange={(e) => f.set(e.target.value)} required
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: "8px",
                    background: bg, border: `1px solid ${bdr}`,
                    color: t1, fontSize: "14px", outline: "none",
                    transition: "border-color 0.2s", fontFamily: "inherit",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(0,133,226,0.5)")}
                  onBlur={(e)  => (e.target.style.borderColor = bdr)}
                />
              </div>
            ))}

            {erro && (
              <div style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", color: "#F87171", fontSize: "13px" }}>
                ⚠ {erro}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                width: "100%", padding: "11px 20px", borderRadius: "8px",
                background: loading ? "#10141F" : `linear-gradient(135deg, #005499, #0085E2)`,
                border: "none", color: loading ? t3 : "#fff",
                fontSize: "14px", fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s", fontFamily: "inherit", marginTop: "4px",
                boxShadow: loading ? "none" : "0 4px 16px rgba(0,133,226,0.35)",
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
