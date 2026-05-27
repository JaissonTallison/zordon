import { useState, useEffect } from "react";
import {
  LayoutDashboard, Bolt, BrainCircuit, Boxes,
  TrendingUp, SlidersVertical, Settings2, ChevronLeft,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

// ── Menu items ──────────────────────────────────────────────
const MENU = [
  { id: "home",       icon: LayoutDashboard, path: "/",             label: "Dashboard",  sub: "Visão geral"        },
  { id: "decisions",  icon: Bolt,            path: "/decisions",    label: "Decisões",   sub: "Ações prioritárias", badge: { text: "LIVE", color: "#34D399" } },
  { id: "inteligencia",icon: BrainCircuit,   path: "/inteligencia", label: "Inteligência",sub: "Engine analítica",  badge: { text: "IA", color: "#0085E2"  } },
  { id: "produtos",   icon: Boxes,           path: "/produtos",     label: "Produtos",   sub: "Estoque & inventário" },
  { id: "impacto",    icon: TrendingUp,      path: "/impacto",      label: "Impacto",    sub: "Análise financeira"  },
  { id: "regras",     icon: SlidersVertical, path: "/regras",       label: "Regras",     sub: "Motor de regras"    },
  { id: "config",     icon: Settings2,       path: "/configuracoes",label: "Config",     sub: "Preferências"       },
];

// ── Palette ─────────────────────────────────────────────────
const C = {
  bg:         "#080A13",
  border:     "rgba(255,255,255,0.07)",
  brand:      "#0085E2",
  brandBg:    "rgba(0,133,226,0.08)",
  brandBdr:   "rgba(0,133,226,0.2)",
  brandGlow:  "rgba(0,133,226,0.35)",
  brandLight: "#38BDFF",
  text1:      "#F0F4FF",
  text2:      "#9BA8C0",
  text3:      "#5A6480",
  text4:      "#2E3550",
  gold:       "#FCD34D",
  red:        "#F87171",
};

const W_OPEN   = 228;
const W_CLOSED =  64;
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
        background: "#10141F",
        border: `1px solid ${C.border}`,
        borderRadius: "8px", padding: "7px 12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
      }}>
        <div style={{ fontSize: "12px", fontWeight: 600, color: C.text1 }}>{label}</div>
        {sub && <div style={{ fontSize: "10px", color: C.text3, marginTop: "1px" }}>{sub}</div>}
        <div style={{
          position: "absolute", left: "-5px", top: "50%",
          transform: "translateY(-50%) rotate(45deg)",
          width: "9px", height: "9px",
          background: "#10141F",
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
          gap: collapsed ? 0 : "11px",
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? "10px 0" : "9px 12px",
          borderRadius: "10px", border: "none",
          cursor: "pointer", textAlign: "left",
          outline: "none", overflow: "hidden",
          transition: TRANS,
          background: isActive ? C.brandBg : hover ? "rgba(255,255,255,0.04)" : "transparent",
        }}
      >
        {/* Active left bar */}
        <div style={{
          position: "absolute", left: 0, top: "50%",
          transform: `translateY(-50%) scaleY(${isActive ? 1 : 0})`,
          width: "3px", height: "22px",
          borderRadius: "0 3px 3px 0",
          background: `linear-gradient(180deg, ${C.brandLight}, ${C.brand})`,
          boxShadow: isActive ? `0 0 10px ${C.brandGlow}` : "none",
          transition: TRANS,
        }} />

        {/* Icon box */}
        <div style={{
          position: "relative",
          width: "34px", height: "34px", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "9px",
          background: isActive ? "rgba(0,133,226,0.12)" : hover ? "rgba(255,255,255,0.05)" : "transparent",
          border: isActive ? `1px solid ${C.brandBdr}` : "1px solid transparent",
          transition: TRANS,
        }}>
          <Icon
            size={16} strokeWidth={isActive ? 2.2 : 1.7}
            color={isActive ? C.brand : hover ? C.text2 : C.text3}
            style={{ transition: "color 0.2s" }}
          />
          {isActive && (
            <div style={{
              position: "absolute", inset: -4,
              background: "radial-gradient(circle, rgba(0,133,226,0.18) 0%, transparent 70%)",
              borderRadius: "50%", pointerEvents: "none",
            }} />
          )}
        </div>

        {/* Label + sub */}
        <div style={{
          flex: 1,
          opacity: collapsed ? 0 : 1,
          maxWidth: collapsed ? 0 : "180px",
          overflow: "hidden", transition: TRANS,
          display: "flex", flexDirection: "column", gap: "1px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{
              fontSize: "13px",
              fontWeight: isActive ? 600 : 400,
              color: isActive ? C.text1 : hover ? C.text2 : C.text3,
              whiteSpace: "nowrap", transition: "color 0.2s",
            }}>
              {item.label}
            </span>
            {item.badge && (
              <span style={{
                fontSize: "9px", fontWeight: 700, letterSpacing: "0.06em",
                padding: "1px 5px", borderRadius: "20px",
                background: `${item.badge.color}15`,
                color: item.badge.color,
                border: `1px solid ${item.badge.color}30`,
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {item.badge.text}
              </span>
            )}
          </div>
          <span style={{
            fontSize: "10px",
            color: isActive ? "rgba(0,133,226,0.7)" : C.text4,
            whiteSpace: "nowrap", transition: "color 0.2s",
          }}>
            {item.sub}
          </span>
        </div>

        {/* Active dot */}
        {!collapsed && isActive && (
          <div style={{
            width: "5px", height: "5px", borderRadius: "50%",
            background: C.brand,
            boxShadow: `0 0 8px ${C.brandGlow}`,
            flexShrink: 0,
            animation: "pulse-brand 2s ease-in-out infinite",
          }} />
        )}
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
      padding:    collapsed ? "16px 8px" : "16px 10px",
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
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>

        {/* Logo row */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "6px 0 18px" : "6px 4px 18px",
          gap: "8px",
        }}>
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", flexShrink: 0 }}
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
              maxWidth: collapsed ? 0 : "120px",
              transition: TRANS,
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
                <span style={{
                  fontSize: "14px", fontWeight: 700,
                  color: C.text1, letterSpacing: "0.08em", whiteSpace: "nowrap",
                }}>
                  ZORDON
                </span>
                <span style={{
                  fontSize: "9px", fontWeight: 800, letterSpacing: "0.18em",
                  background: "linear-gradient(90deg, #D97706, #FCD34D, #D97706)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace",
                }}>
                  PRO
                </span>
              </div>
            </div>
          </div>

          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              onMouseEnter={() => setHoverToggle(true)}
              onMouseLeave={() => setHoverToggle(false)}
              style={{
                width: "26px", height: "26px", borderRadius: "7px",
                border: `1px solid ${hoverToggle ? C.brandBdr : C.border}`,
                background: hoverToggle ? C.brandBg : "transparent",
                color: hoverToggle ? C.brand : C.text4,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s", flexShrink: 0,
              }}
            >
              <ChevronLeft size={13} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Divider */}
        <div style={{
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${C.border}, transparent)`,
          margin: "0 4px 10px",
        }} />

        {/* Nav label */}
        <div style={{
          display: "flex", alignItems: "center",
          padding: collapsed ? "0" : "0 6px",
          marginBottom: "6px",
          justifyContent: collapsed ? "center" : "flex-start",
          overflow: "hidden",
        }}>
          {collapsed ? (
            <div style={{ width: "20px", height: "1px", background: C.text4, borderRadius: "1px" }} />
          ) : (
            <span style={{ fontSize: "9px", color: C.text4, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>
              Navegação
            </span>
          )}
        </div>

        {/* Menu */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
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
          margin: "10px 4px 8px",
        }} />

        {collapsed ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => setCollapsed(false)}
              style={{
                width: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "8px 0", borderRadius: "10px",
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
              <ChevronLeft size={13} strokeWidth={2.2} style={{ transform: "rotate(180deg)" }} />
            </button>
            <span style={{ fontSize: "9px", color: C.text4, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em" }}>
              v2.0
            </span>
          </div>
        ) : (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "6px 8px", borderRadius: "8px",
            background: "rgba(255,255,255,0.02)",
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: "5px", height: "5px", borderRadius: "50%",
                background: C.brand,
                boxShadow: `0 0 5px ${C.brandGlow}`,
                animation: "pulse-brand 2.5s ease-in-out infinite",
              }} />
              <span style={{
                fontSize: "10px", fontWeight: 600, color: C.text3,
                fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em",
              }}>
                v2.0.0
              </span>
            </div>
            <span style={{
              fontSize: "9px", padding: "1px 6px", borderRadius: "20px",
              background: "rgba(0,133,226,0.08)",
              border: "1px solid rgba(0,133,226,0.2)",
              color: C.brand,
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em",
            }}>
              stable
            </span>
          </div>
        )}
      </div>
    </nav>
  );
}
