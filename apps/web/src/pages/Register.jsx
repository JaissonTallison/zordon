import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const FIELDS = [
  { name: "nome",         label: "Nome completo",      type: "text",     placeholder: "João Silva"           },
  { name: "email",        label: "Email",               type: "email",    placeholder: "joao@empresa.com"     },
  { name: "senha",        label: "Senha",               type: "password", placeholder: "••••••••"             },
  { name: "empresa_nome", label: "Nome da empresa",     type: "text",     placeholder: "Minha Empresa LTDA"   },
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
    <div
      className="min-h-screen flex"
      style={{ background: "#03080F", fontFamily: "'Inter', sans-serif" }}
    >
      {/* LEFT PANEL */}
      <div
        className="hidden md:flex flex-col justify-between relative overflow-hidden"
        style={{
          width: "46%",
          background: "#050C18",
          borderRight: "1px solid rgba(26,48,80,0.5)",
          padding: "48px",
        }}
      >
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(26,48,80,0.3) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: "-40px", left: "-40px",
            width: "350px", height: "350px",
            background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="relative flex items-center gap-3">
          <img
            src="/logo.png"
            alt="ZORDON"
            style={{
              width: "44px", height: "44px",
              borderRadius: "12px",
              objectFit: "contain",
              filter: "drop-shadow(0 0 12px rgba(0,212,245,0.35))",
            }}
          />
          <div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#E2E8F0", letterSpacing: "0.06em" }}>ZORDON</div>
            <div style={{ fontSize: "10px", color: "#4A6480", letterSpacing: "0.1em", textTransform: "uppercase" }}>Intelligence Platform</div>
          </div>
        </div>

        <div className="relative space-y-5">
          <h2
            style={{
              fontSize: "clamp(22px, 2.5vw, 30px)",
              fontWeight: 700,
              color: "#E2E8F0",
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
            }}
          >
            Comece a{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #8B5CF6, #00D4F5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              tomar decisões inteligentes
            </span>{" "}
            hoje mesmo
          </h2>
          <p style={{ fontSize: "14px", color: "#4A6480", lineHeight: 1.6 }}>
            Configure sua empresa e deixe o ZORDON identificar problemas, calcular impactos
            e recomendar ações — automaticamente.
          </p>

          {/* FEATURES */}
          {[
            "Engine de inferência por regras determinísticas",
            "Cálculo automático de impacto financeiro",
            "Priorização inteligente de decisões",
            "Multi-tenant e pronto para escalar",
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00D4F5", boxShadow: "0 0 6px rgba(0,212,245,0.8)", flexShrink: 0 }} />
              <span style={{ fontSize: "13px", color: "#64748B" }}>{f}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: "11px", color: "#1A3050", letterSpacing: "0.04em" }}>
          © 2026 ZORDON Intelligence
        </div>
      </div>

      {/* RIGHT PANEL — FORM */}
      <div
        className="flex flex-1 items-center justify-center"
        style={{ padding: "48px 32px" }}
      >
        <div style={{ width: "100%", maxWidth: "380px" }}>

          <div style={{ marginBottom: "28px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#E2E8F0", letterSpacing: "-0.01em" }}>
              Criar conta
            </h2>
            <p style={{ fontSize: "13px", color: "#4A6480", marginTop: "4px" }}>
              Configure seu ambiente operacional
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {FIELDS.map((f) => (
              <div key={f.name}>
                <label style={{ display: "block", fontSize: "11px", color: "#64748B", marginBottom: "6px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
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
                    background: "rgba(10,22,40,0.8)",
                    border: "1px solid rgba(26,48,80,0.8)",
                    color: "#E2E8F0", fontSize: "14px", outline: "none",
                    transition: "border-color 0.2s", fontFamily: "inherit",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(0,212,245,0.5)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(26,48,80,0.8)"}
                />
              </div>
            ))}

            {erro && (
              <div style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444", fontSize: "13px" }}>
                ⚠ {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "11px 20px", borderRadius: "8px",
                background: loading ? "rgba(26,48,80,0.5)" : "linear-gradient(135deg, rgba(139,92,246,0.8), rgba(0,212,245,0.8))",
                border: "none", color: loading ? "#4A6480" : "#fff",
                fontSize: "14px", fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s", fontFamily: "inherit", marginTop: "4px",
              }}
            >
              {loading ? "Criando ambiente..." : "Criar conta e entrar"}
            </button>
          </form>

          <div style={{ marginTop: "20px", textAlign: "center", fontSize: "13px", color: "#4A6480" }}>
            Já tem conta?{" "}
            <Link to="/login" style={{ color: "#00D4F5", textDecoration: "none", fontWeight: 500 }}>
              Entrar
            </Link>
          </div>

          <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid rgba(26,48,80,0.5)", textAlign: "center", fontSize: "11px", color: "#1A3050" }}>
            © 2026 ZORDON Intelligence · Todos os direitos reservados
          </div>
        </div>
      </div>
    </div>
  );
}
