import { useState, useEffect } from "react";
import {
  LayoutDashboard, Bolt, BrainCircuit, Boxes,
  TrendingUp, SlidersVertical, Settings2, ChevronLeft,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

// ── Menu items ──────────────────────────────────────────────
const MENU = [
  { id: "home",       icon: LayoutDashboard, path: "/",             label: "Dashboard",  sub: "Visão geral"        },
  { id: "decisions",  icon: Bolt,            path: "/decisions",    label: "Decisões",   sub: "Ações prioritárias" },
  { id: "inteligencia",icon: BrainCircuit,   path: "/inteligencia", label: "Inteligência",sub: "Engine analítica"  },
  { id: "produtos",   icon: Boxes,           path: "/produtos",     label: "Produtos",   sub: "Estoque & inventário" },
  { id: "impacto",    icon: TrendingUp,      path: "/impacto",      label: "Impacto",    sub: "Análise financeira"  },
  { id: "regras",     icon: SlidersVertical, path: "/regras",       label: "Regras",     sub: "Motor de regras"    },
  { id: "config",     icon: Settings2,       path: "/configuracoes",label: "Config",     sub: "Preferências"       },
];

// ── Palette ─────────────────────────────────────────────────
const C = {
  bg:         "#FFFFFF",
  border:     "rgba(0,0,0,0.08)",
  brand:      "#0085E2",
  brandBg:    "rgba(0,133,226,0.08)",
  brandBdr:   "rgba(0,133,226,0.25)",
  brandGlow:  "rgba(0,133,226,0.35)",
  brandLight: "#38BDFF",
  text1:      "#0F172A",
  text2:      "#475569",
  text3:      "#64748B",
  text4:      "#94A3B8",
  gold:       "#FCD34D",
  red:        "#DC2626",
};

const W_OPEN   = 240;
const W_CLOSED =  68;
const TRANS    = "all 0.32s cubic-bezier(0.4,0,0.2,1)";

// ── Tooltip ─────────────────────────────────────────────────
function Tooltip({ label, sub, visible }) {
  return (
    <div style={{
      position: "absolute", left: "calc(100% + 10px)", top: "50%",
      transform: `translateY(-50%) ${visible ? "scale(1)" : "scale(0.9)"}`,
      pointerEvents: "none",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.18s ease, transform 0.18s ease",
      zIndex: 999, whiteSpace: "nowrap",
    }}>
      <div style={{
        background: "#FFFFFF",
        border: `1px solid ${C.border}`,
        borderRadius: "10px", padding: "8px 13px",
        boxShadow: "0 8px 24px rgba(15,23,42,0.15)",
      }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: C.text1 }}>{label}</div>
        {sub && <div style={{ fontSize: "11px", color: C.text3, marginTop: "1px" }}>{sub}</div>}
        <div style={{
          position: "absolute", left: "-5px", top: "50%",
          transform: "translateY(-50%) rotate(45deg)",
          width: "9px", height: "9px",
          background: "#FFFFFF",
          border: `1px solid ${C.border}`,
          borderRight: "none", borderTop: "none",
        }} />
      </div>
    </div>
  );
}

// ── MenuItem ─────────────────────────────────────────────────
function MenuItem({ item, isActive, collapsed, onClick }) {
  const [hover, setHover] = useState(false);
  const Icon = item.icon;

  return (
    <div style={{ position: "relative" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        onClick={onClick}
        title={collapsed ? item.label : undefined}
        style={{
          position: "relative", width: "100%",
          display: "flex", alignItems: "center",
          gap: collapsed ? 0 : "12px",
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? "11px 0" : "10px 14px",
          borderRadius: "14px", border: "none",
          cursor: "pointer", textAlign: "left",
          outline: "none", overflow: "hidden",
          transition: TRANS,
          background: isActive ? C.brandBg : hover ? "rgba(15,23,42,0.04)" : "transparent",
        }}
      >
        {/* Icon box — carrega a cor do item, sem barra de destaque */}
        <div style={{
          position: "relative",
          width: "36px", height: "36px", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "12px",
          background: isActive ? "rgba(0,133,226,0.12)" : hover ? "rgba(15,23,42,0.04)" : "transparent",
          transition: TRANS,
        }}>
          <Icon
            size={17} strokeWidth={isActive ? 2.1 : 1.8}
            color={isActive ? C.brand : hover ? C.text2 : C.text3}
            style={{ transition: "color 0.2s" }}
          />
        </div>

        {/* Label + sub */}
        <div style={{
          flex: 1,
          opacity: collapsed ? 0 : 1,
          maxWidth: collapsed ? 0 : "180px",
          overflow: "hidden", transition: TRANS,
          display: "flex", flexDirection: "column", gap: "1px",
        }}>
          <span style={{
            fontSize: "14px",
            fontWeight: isActive ? 600 : 500,
            color: isActive ? C.text1 : hover ? C.text2 : C.text3,
            whiteSpace: "nowrap", transition: "color 0.2s",
          }}>
            {item.label}
          </span>
          <span style={{
            fontSize: "12px",
            color: isActive ? "rgba(0,133,226,0.75)" : C.text4,
            whiteSpace: "nowrap", transition: "color 0.2s",
          }}>
            {item.sub}
          </span>
        </div>
      </button>

      {collapsed && <Tooltip label={item.label} sub={item.sub} visible={hover} />}
    </div>
  );
}

// ── NavigationRail ───────────────────────────────────────────
export default function NavigationRail() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("sidebar_collapsed") === "true"
  );
  const [hoverToggle, setHoverToggle] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", collapsed);
  }, [collapsed]);

  return (
    <nav style={{
      width:      collapsed ? W_CLOSED : W_OPEN,
      minWidth:   collapsed ? W_CLOSED : W_OPEN,
      flexShrink: 0,
      display:    "flex", flexDirection: "column",
      justifyContent: "space-between",
      background: C.bg,
      borderRight: `1px solid ${C.border}`,
      padding:    collapsed ? "18px 10px" : "18px 12px",
      position:   "relative", overflow: "hidden",
      transition: TRANS, zIndex: 50,
    }}>

      {/* Top glow accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: `linear-gradient(90deg, transparent, ${C.brandGlow}, transparent)`,
      }} />
      <div style={{
        position: "absolute", top: 0, left: "-40px", width: "120px", height: "80px",
        background: "radial-gradient(ellipse, rgba(0,133,226,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* ── TOP ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>

        {/* Logo row */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "6px 0 20px" : "6px 4px 20px",
          gap: "8px",
        }}>
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{ display: "flex", alignItems: "center", gap: collapsed ? 0 : "11px", cursor: "pointer", flexShrink: 0 }}
          >
            <div style={{
              position: "relative",
              width: collapsed ? "38px" : "40px",
              height: collapsed ? "38px" : "40px",
              flexShrink: 0, transition: TRANS,
            }}>
              <img
                src="/logo.png" alt="ZORDON"
                style={{
                  width: "100%", height: "100%",
                  borderRadius: "10px", objectFit: "contain",
                  filter: "drop-shadow(0 0 10px rgba(0,133,226,0.3))",
                  transition: TRANS,
                }}
              />
            </div>

            <div style={{
              overflow: "hidden",
              opacity: collapsed ? 0 : 1,
              maxWidth: collapsed ? 0 : "160px",
              transition: TRANS,
            }}>
              <div style={{
                fontSize: "16px", fontWeight: 700,
                color: C.text1, letterSpacing: "0.01em", whiteSpace: "nowrap", lineHeight: 1.2,
              }}>
                ZORDON
              </div>
              <div style={{
                fontSize: "10px", fontWeight: 600,
                color: C.text4, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap",
              }}>
                Intelligence Platform
              </div>
            </div>
          </div>

          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              onMouseEnter={() => setHoverToggle(true)}
              onMouseLeave={() => setHoverToggle(false)}
              style={{
                width: "28px", height: "28px", borderRadius: "9px",
                border: `1px solid ${hoverToggle ? C.brandBdr : C.border}`,
                background: hoverToggle ? C.brandBg : "transparent",
                color: hoverToggle ? C.brand : C.text4,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s", flexShrink: 0,
              }}
            >
              <ChevronLeft size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Divider */}
        <div style={{
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${C.border}, transparent)`,
          margin: "0 4px 16px",
        }} />

        {/* Menu */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          {MENU.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              isActive={location.pathname === item.path}
              collapsed={collapsed}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>
      </div>

      {/* ── BOTTOM ── */}
      <div>
        <div style={{
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${C.border}, transparent)`,
          margin: "12px 4px 10px",
        }} />

        {collapsed ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "9px" }}>
            <button
              onClick={() => setCollapsed(false)}
              style={{
                width: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "9px 0", borderRadius: "12px",
                border: `1px solid ${C.border}`,
                background: "transparent", color: C.text3,
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.brandBg;
                e.currentTarget.style.borderColor = C.brandBdr;
                e.currentTarget.style.color = C.brand;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.color = C.text3;
              }}
            >
              <ChevronLeft size={14} strokeWidth={2.2} style={{ transform: "rotate(180deg)" }} />
            </button>
            <span style={{ fontSize: "10px", color: C.text4, fontFamily: "'JetBrains Mono', monospace" }}>
              v2.0
            </span>
          </div>
        ) : (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 14px", borderRadius: "12px",
            background: "rgba(15,23,42,0.03)",
          }}>
            <span style={{
              fontSize: "12px", fontWeight: 600, color: C.text3,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              v2.0.0
            </span>
            <span style={{
              fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px",
              background: "rgba(4,120,87,0.1)",
              color: "#047857",
            }}>
              Stable
            </span>
          </div>
        )}
      </div>
    </nav>
  );
}
