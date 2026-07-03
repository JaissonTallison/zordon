import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, Zap, ChevronDown, LogOut,
  User, Settings2, Shield, Clock,
  LayoutDashboard, Bolt, BrainCircuit, Boxes, TrendingUp, SlidersVertical,
} from "lucide-react";
import api from "../../services/api";

const C = {
  bg:       "#FFFFFF",
  border:   "rgba(0,0,0,0.08)",
  t1:       "#0F172A",
  t2:       "#475569",
  t3:       "#64748B",
  t4:       "#94A3B8",
  brand:    "#0085E2",
  brandLt:  "#38BDFF",
  brandBg:  "rgba(0,133,226,0.08)",
  brandBdr: "rgba(0,133,226,0.25)",
  green:    "#047857",
  amber:    "#B45309",
  red:      "#DC2626",
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
      display: "flex", alignItems: "center", gap: "8px",
      padding: "6px 13px", borderRadius: "10px",
      background: "rgba(15,23,42,0.03)",
      border: `1px solid ${C.border}`,
    }}>
      <Clock size={12} color={C.t4} strokeWidth={1.8} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
        <span style={{
          fontSize: "13px", fontWeight: 600,
          color: C.t2, fontFamily: "'JetBrains Mono', monospace",
        }}>{hora}</span>
        <span style={{ fontSize: "11px", color: C.t4, textTransform: "capitalize" }}>{data}</span>
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
      // A engine rodou e persistiu novas decisões — recarrega a página pra
      // refletir os dados novos em qualquer tela (KPIs, listas, tabelas).
      setTimeout(() => window.location.reload(), 700);
    } catch {
      setLoading(false);
    }
  }

  const color  = ok ? C.green : C.brand;
  const bgCol  = ok ? "rgba(52,211,153,0.08)" : C.brandBg;
  const bdrCol = ok ? "rgba(52,211,153,0.22)" : C.brandBdr;

  return (
    <button
      onClick={run}
      disabled={loading}
      style={{
        display: "flex", alignItems: "center", gap: "7px",
        padding: "8px 16px", borderRadius: "10px",
        background: bgCol, border: `1px solid ${bdrCol}`,
        color, cursor: loading ? "not-allowed" : "pointer",
        fontFamily: "inherit", fontSize: "13px", fontWeight: 600,
        transition: "all 0.2s",
        opacity: loading ? 0.6 : 1,
      }}
    >
      <Zap size={13} strokeWidth={2.5} style={{ animation: loading ? "spin-slow 0.8s linear infinite" : "none" }} />
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
          width: "38px", height: "38px", borderRadius: "11px",
          border: `1px solid ${open ? C.brandBdr : C.border}`,
          background: open ? C.brandBg : "transparent",
          color: open ? C.brand : C.t3,
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.18s",
        }}
        onMouseEnter={(e) => { if (!open) { e.currentTarget.style.background = "rgba(15,23,42,0.04)"; e.currentTarget.style.color = C.t2; } }}
        onMouseLeave={(e) => { if (!open) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.t3; } }}
      >
        <Bell size={15} strokeWidth={1.8} />
        {count > 0 && (
          <div style={{
            position: "absolute", top: "6px", right: "6px",
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
          width: "320px",
          background: "#FFFFFF",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: "14px",
          boxShadow: "0 16px 48px rgba(15,23,42,0.18)",
          overflow: "hidden", zIndex: 200,
          animation: "fade-in-up 0.18s ease-out",
        }}>
          <div style={{
            padding: "14px 18px 12px",
            borderBottom: "1px solid rgba(15,23,42,0.06)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: C.t1 }}>Notificações</span>
            <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px", background: "rgba(248,113,113,0.1)", color: C.red }}>{count} novas</span>
          </div>

          {NOTIFS.map((n) => (
            <div key={n.id} style={{
              padding: "13px 18px",
              borderBottom: "1px solid rgba(15,23,42,0.05)",
              display: "flex", gap: "11px", alignItems: "flex-start",
              cursor: "pointer", transition: "background 0.15s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(15,23,42,0.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: n.cor, flexShrink: 0, marginTop: "6px", boxShadow: `0 0 5px ${n.cor}` }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "13px", color: C.t2, lineHeight: 1.4 }}>{n.msg}</p>
                <span style={{ fontSize: "11px", color: C.t4 }}>{n.ts}</span>
              </div>
            </div>
          ))}

          <div style={{ padding: "11px 18px" }}>
            <button style={{
              width: "100%", padding: "8px", borderRadius: "9px",
              border: `1px solid ${C.border}`,
              background: "transparent", color: C.t4,
              fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
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
    VIEWER:   { label: "Viewer",   color: C.t3,    bg: "rgba(100,116,139,0.1)" },
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
          display: "flex", alignItems: "center", gap: "10px",
          padding: "6px 6px 6px 12px", borderRadius: "12px",
          border: `1px solid ${open ? C.brandBdr : C.border}`,
          background: open ? "rgba(0,133,226,0.06)" : "rgba(15,23,42,0.03)",
          cursor: "pointer", transition: "all 0.2s", outline: "none",
        }}
        onMouseEnter={(e) => { if (!open) e.currentTarget.style.borderColor = C.brandBdr; }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.borderColor = C.border; }}
      >
        <div style={{ textAlign: "left", lineHeight: 1.25 }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: C.t1, whiteSpace: "nowrap" }}>{user.nome || "Usuário"}</div>
          <div style={{ fontSize: "11px", color: role.color, fontWeight: 600 }}>{role.label}</div>
        </div>

        <div style={{
          width: "34px", height: "34px", borderRadius: "10px",
          background: "linear-gradient(135deg, rgba(0,133,226,0.25), rgba(0,119,203,0.4))",
          border: "1px solid rgba(0,133,226,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "13px", fontWeight: 700, color: C.brand,
          fontFamily: "'JetBrains Mono', monospace", flexShrink: 0,
        }}>
          {initials}
        </div>

        <ChevronDown
          size={13} strokeWidth={2.5} color={C.t4}
          style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          width: "236px",
          background: "#FFFFFF",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: "14px",
          boxShadow: "0 16px 48px rgba(15,23,42,0.18)",
          overflow: "hidden", zIndex: 200,
          animation: "fade-in-up 0.18s ease-out",
        }}>
          <div style={{
            padding: "16px 18px",
            borderBottom: "1px solid rgba(15,23,42,0.06)",
            background: "rgba(0,133,226,0.03)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
              <div style={{
                width: "38px", height: "38px", borderRadius: "11px",
                background: "linear-gradient(135deg, rgba(0,133,226,0.3), rgba(0,119,203,0.5))",
                border: "1px solid rgba(0,133,226,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", fontWeight: 700, color: C.brand,
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {initials}
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: C.t1 }}>{user.nome || "Usuário"}</div>
                <div style={{ fontSize: "12px", color: C.t3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "140px" }}>{user.email || ""}</div>
              </div>
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              marginTop: "10px", padding: "3px 10px", borderRadius: "20px",
              background: role.bg, border: `1px solid ${role.color}25`,
            }}>
              <Shield size={10} color={role.color} />
              <span style={{ fontSize: "10px", color: role.color, fontWeight: 700 }}>{role.label}</span>
            </div>
          </div>

          <div style={{ padding: "7px" }}>
            {[
              { icon: User,      label: "Meu perfil",   action: () => { navigate("/configuracoes"); setOpen(false); } },
              { icon: Settings2, label: "Configurações", action: () => { navigate("/configuracoes"); setOpen(false); } },
            ].map((item) => (
              <button key={item.label} onClick={item.action} style={{
                width: "100%",
                display: "flex", alignItems: "center", gap: "10px",
                padding: "9px 11px", borderRadius: "9px",
                border: "none", background: "transparent",
                color: C.t2, fontSize: "13px",
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", textAlign: "left",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(15,23,42,0.04)"; e.currentTarget.style.color = C.t1; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.t2; }}
              >
                <item.icon size={14} strokeWidth={1.8} />
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ padding: "7px", borderTop: "1px solid rgba(15,23,42,0.06)" }}>
            <button onClick={logout} style={{
              width: "100%",
              display: "flex", alignItems: "center", gap: "10px",
              padding: "9px 11px", borderRadius: "9px",
              border: "none", background: "transparent",
              color: C.red, fontSize: "13px",
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", textAlign: "left",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <LogOut size={14} strokeWidth={1.8} />
              Sair da conta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Sep() {
  return <div style={{ width: "1px", height: "24px", background: C.border, flexShrink: 0 }} />;
}

// ── TopBar ────────────────────────────────────────────────────
export default function TopBar({ page }) {
  const ICONS = {
    "/":              LayoutDashboard,
    "/decisions":     Bolt,
    "/inteligencia":  BrainCircuit,
    "/produtos":      Boxes,
    "/impacto":       TrendingUp,
    "/regras":        SlidersVertical,
    "/configuracoes": Settings2,
  };
  const PageIcon = ICONS[page.path] || LayoutDashboard;

  return (
    <header style={{
      height: "64px", flexShrink: 0,
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px 0 28px",
      background: "rgba(255,255,255,0.92)",
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
        style={{ display: "flex", alignItems: "center", gap: "12px", animation: "slide-in-right 0.22s ease-out" }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "6px 14px 6px 10px", borderRadius: "10px",
          background: "rgba(0,133,226,0.06)",
          border: "1px solid rgba(0,133,226,0.15)",
        }}>
          <PageIcon size={15} strokeWidth={2} color={C.brand} />
          <span style={{ fontSize: "14px", fontWeight: 700, color: C.t1 }}>{page.label}</span>
        </div>

        {page.sub && (
          <>
            <span style={{ color: C.t4, fontSize: "13px" }}>—</span>
            <span style={{ fontSize: "13px", color: C.t3 }}>{page.sub}</span>
          </>
        )}
      </div>

      {/* Right: actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
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
