import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, Zap, ChevronDown, LogOut,
  User, Settings2, Shield, Clock,
} from "lucide-react";
import api from "../../services/api";

const C = {
  bg:       "#080A13",
  border:   "rgba(255,255,255,0.07)",
  t1:       "#F0F4FF",
  t2:       "#9BA8C0",
  t3:       "#5A6480",
  t4:       "#2E3550",
  brand:    "#0085E2",
  brandLt:  "#38BDFF",
  brandBg:  "rgba(0,133,226,0.08)",
  brandBdr: "rgba(0,133,226,0.2)",
  green:    "#34D399",
  amber:    "#FBBF24",
  red:      "#F87171",
};

// ── Clock ─────────────────────────────────────────────────────
function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hora = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const data = now.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "7px",
      padding: "5px 11px", borderRadius: "8px",
      background: "rgba(255,255,255,0.02)",
      border: `1px solid ${C.border}`,
    }}>
      <Clock size={11} color={C.t4} strokeWidth={1.8} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
        <span style={{
          fontSize: "12px", fontWeight: 600,
          color: C.t2, fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.04em",
        }}>{hora}</span>
        <span style={{ fontSize: "9px", color: C.t4, textTransform: "capitalize", letterSpacing: "0.03em" }}>{data}</span>
      </div>
    </div>
  );
}

// ── Engine Button ─────────────────────────────────────────────
function EngineButton() {
  const [loading, setLoading] = useState(false);
  const [ok,      setOk]      = useState(false);

  async function run() {
    if (loading) return;
    setLoading(true);
    try {
      await api.post("/engine/executar");
      setOk(true);
      setTimeout(() => setOk(false), 2500);
    } catch {}
    finally { setLoading(false); }
  }

  const color  = ok ? C.green : C.brand;
  const bgCol  = ok ? "rgba(52,211,153,0.08)" : C.brandBg;
  const bdrCol = ok ? "rgba(52,211,153,0.22)" : C.brandBdr;

  return (
    <button
      onClick={run}
      disabled={loading}
      style={{
        display: "flex", alignItems: "center", gap: "6px",
        padding: "6px 13px", borderRadius: "8px",
        background: bgCol, border: `1px solid ${bdrCol}`,
        color, cursor: loading ? "not-allowed" : "pointer",
        fontFamily: "inherit", fontSize: "11px", fontWeight: 600,
        letterSpacing: "0.04em", transition: "all 0.2s",
        opacity: loading ? 0.6 : 1,
      }}
    >
      <Zap size={12} strokeWidth={2.5} style={{ animation: loading ? "spin-slow 0.8s linear infinite" : "none" }} />
      {loading ? "Rodando…" : ok ? "Concluído" : "Executar"}
    </button>
  );
}

// ── Notifications ─────────────────────────────────────────────
function NotifBell() {
  const [open, setOpen] = useState(false);
  const [count]         = useState(3);
  const ref             = useRef(null);

  const NOTIFS = [
    { id: 1, msg: "Teclado Mecânico RGB com estoque zerado",       ts: "há 2 min",  cor: C.red   },
    { id: 2, msg: "Monitor LG 27\" abaixo do estoque mínimo",      ts: "há 14 min", cor: C.amber },
    { id: 3, msg: "Engine executada — 28 decisões identificadas",  ts: "há 1h",     cor: C.brand },
  ];

  useEffect(() => {
    function onClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "relative",
          width: "34px", height: "34px", borderRadius: "9px",
          border: `1px solid ${open ? C.brandBdr : C.border}`,
          background: open ? C.brandBg : "transparent",
          color: open ? C.brand : C.t3,
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.18s",
        }}
        onMouseEnter={(e) => { if (!open) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = C.t2; } }}
        onMouseLeave={(e) => { if (!open) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.t3; } }}
      >
        <Bell size={14} strokeWidth={1.8} />
        {count > 0 && (
          <div style={{
            position: "absolute", top: "5px", right: "5px",
            width: "7px", height: "7px", borderRadius: "50%",
            background: C.red, border: `1.5px solid ${C.bg}`,
            boxShadow: "0 0 5px rgba(248,113,113,0.8)",
            animation: "pulse-red 2s ease-in-out infinite",
          }} />
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          width: "300px",
          background: "#0D111E",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
          overflow: "hidden", zIndex: 200,
          animation: "fade-in-up 0.18s ease-out",
        }}>
          <div style={{
            padding: "12px 16px 10px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: C.t1 }}>Notificações</span>
            <span style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "20px", background: "rgba(248,113,113,0.1)", color: C.red, fontFamily: "'JetBrains Mono', monospace" }}>{count} novas</span>
          </div>

          {NOTIFS.map((n) => (
            <div key={n.id} style={{
              padding: "11px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              display: "flex", gap: "10px", alignItems: "flex-start",
              cursor: "pointer", transition: "background 0.15s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: n.cor, flexShrink: 0, marginTop: "5px", boxShadow: `0 0 5px ${n.cor}` }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "12px", color: C.t2, lineHeight: 1.4 }}>{n.msg}</p>
                <span style={{ fontSize: "10px", color: C.t4, fontFamily: "'JetBrains Mono', monospace" }}>{n.ts}</span>
              </div>
            </div>
          ))}

          <div style={{ padding: "10px 16px" }}>
            <button style={{
              width: "100%", padding: "7px", borderRadius: "7px",
              border: `1px solid ${C.border}`,
              background: "transparent", color: C.t4,
              fontSize: "11px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.brand; e.currentTarget.style.borderColor = C.brandBdr; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.t4; e.currentTarget.style.borderColor = C.border; }}
            >
              Ver todas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── User Menu ─────────────────────────────────────────────────
function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref             = useRef(null);
  const navigate        = useNavigate();
  const user    = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = (user.nome || "U").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const ROLE_CFG = {
    ADMIN:    { label: "Admin",    color: C.brand, bg: "rgba(0,133,226,0.1)"   },
    ANALISTA: { label: "Analista", color: C.green, bg: "rgba(52,211,153,0.1)"  },
    VIEWER:   { label: "Viewer",   color: C.t3,    bg: "rgba(90,100,128,0.1)"  },
  };
  const role = ROLE_CFG[user.role] || ROLE_CFG.ANALISTA;

  useEffect(() => {
    function onClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: "9px",
          padding: "5px 5px 5px 10px", borderRadius: "10px",
          border: `1px solid ${open ? C.brandBdr : C.border}`,
          background: open ? "rgba(0,133,226,0.06)" : "rgba(255,255,255,0.025)",
          cursor: "pointer", transition: "all 0.2s", outline: "none",
        }}
        onMouseEnter={(e) => { if (!open) e.currentTarget.style.borderColor = C.brandBdr; }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.borderColor = C.border; }}
      >
        <div style={{ textAlign: "left", lineHeight: 1.2 }}>
          <div style={{ fontSize: "12px", fontWeight: 600, color: C.t1, whiteSpace: "nowrap" }}>{user.nome || "Usuário"}</div>
          <div style={{ fontSize: "10px", color: role.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em" }}>{role.label}</div>
        </div>

        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: "linear-gradient(135deg, rgba(0,133,226,0.25), rgba(0,119,203,0.4))",
          border: "1px solid rgba(0,133,226,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "12px", fontWeight: 700, color: C.brand,
          fontFamily: "'JetBrains Mono', monospace", flexShrink: 0,
        }}>
          {initials}
        </div>

        <ChevronDown
          size={12} strokeWidth={2.5} color={C.t4}
          style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          width: "220px",
          background: "#0D111E",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
          overflow: "hidden", zIndex: 200,
          animation: "fade-in-up 0.18s ease-out",
        }}>
          <div style={{
            padding: "14px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(0,133,226,0.03)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "9px",
                background: "linear-gradient(135deg, rgba(0,133,226,0.3), rgba(0,119,203,0.5))",
                border: "1px solid rgba(0,133,226,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", fontWeight: 700, color: C.brand,
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {initials}
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: C.t1 }}>{user.nome || "Usuário"}</div>
                <div style={{ fontSize: "10px", color: C.t3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "130px" }}>{user.email || ""}</div>
              </div>
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              marginTop: "8px", padding: "2px 8px", borderRadius: "20px",
              background: role.bg, border: `1px solid ${role.color}25`,
            }}>
              <Shield size={9} color={role.color} />
              <span style={{ fontSize: "9px", color: role.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: "0.06em" }}>{role.label}</span>
            </div>
          </div>

          <div style={{ padding: "6px" }}>
            {[
              { icon: User,      label: "Meu perfil",   action: () => { navigate("/configuracoes"); setOpen(false); } },
              { icon: Settings2, label: "Configurações", action: () => { navigate("/configuracoes"); setOpen(false); } },
            ].map((item) => (
              <button key={item.label} onClick={item.action} style={{
                width: "100%",
                display: "flex", alignItems: "center", gap: "9px",
                padding: "8px 10px", borderRadius: "7px",
                border: "none", background: "transparent",
                color: C.t2, fontSize: "12px",
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", textAlign: "left",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = C.t1; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.t2; }}
              >
                <item.icon size={13} strokeWidth={1.8} />
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ padding: "6px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button onClick={logout} style={{
              width: "100%",
              display: "flex", alignItems: "center", gap: "9px",
              padding: "8px 10px", borderRadius: "7px",
              border: "none", background: "transparent",
              color: C.red, fontSize: "12px",
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", textAlign: "left",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <LogOut size={13} strokeWidth={1.8} />
              Sair da conta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Sep() {
  return <div style={{ width: "1px", height: "22px", background: C.border, flexShrink: 0 }} />;
}

// ── TopBar ────────────────────────────────────────────────────
export default function TopBar({ page }) {
  const ICONS = {
    "/":              "📊",
    "/decisions":     "⚡",
    "/inteligencia":  "🧠",
    "/produtos":      "📦",
    "/impacto":       "📈",
    "/regras":        "⚙️",
    "/configuracoes": "🔧",
  };

  return (
    <header style={{
      height: "56px", flexShrink: 0,
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px 0 24px",
      background: "rgba(8,10,19,0.95)",
      backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${C.border}`,
      position: "relative", zIndex: 100, gap: "16px",
    }}>

      {/* Bottom gradient line */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent 0%, rgba(0,133,226,0.35) 30%, rgba(56,189,255,0.15) 65%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* Left: page info */}
      <div
        key={page.path}
        style={{ display: "flex", alignItems: "center", gap: "10px", animation: "slide-in-right 0.22s ease-out" }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "4px 10px 4px 7px", borderRadius: "8px",
          background: "rgba(0,133,226,0.06)",
          border: "1px solid rgba(0,133,226,0.15)",
        }}>
          <span style={{ fontSize: "13px", lineHeight: 1 }}>{ICONS[page.path] || "📋"}</span>
          <span style={{ fontSize: "13px", fontWeight: 600, color: C.t1, letterSpacing: "0.01em" }}>{page.label}</span>
        </div>

        {page.sub && (
          <>
            <span style={{ color: C.t4, fontSize: "12px" }}>—</span>
            <span style={{ fontSize: "11px", color: C.t4 }}>{page.sub}</span>
          </>
        )}
      </div>

      {/* Right: actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <LiveClock />
        <Sep />
        <EngineButton />
        <NotifBell />
        <Sep />
        <UserMenu />
      </div>
    </header>
  );
}
