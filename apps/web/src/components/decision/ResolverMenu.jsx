import { useState, useRef, useEffect } from "react";
import { CheckCircle, Tag, Handshake, Truck, Flame, ChevronDown } from "lucide-react";

export const ACOES = [
  { id: "promocao",            label: "Criar promoção / desconto",     icon: Tag       },
  { id: "desconto_fornecedor", label: "Pedir desconto ao fornecedor",  icon: Handshake },
  { id: "reposicao",           label: "Solicitar reposição urgente",   icon: Truck     },
  { id: "liquidacao",          label: "Liquidar estoque parado",       icon: Flame     },
  { id: "manual",              label: "Marcar como resolvido",         icon: CheckCircle },
];

export function acaoLabel(id) {
  return ACOES.find((a) => a.id === id)?.label || null;
}

/**
 * Botão "Resolver" com um menu de ações concretas (promoção, desconto com
 * fornecedor, reposição, liquidação...) em vez de só marcar resolvido sem
 * dizer o que foi feito.
 */
export default function ResolverMenu({ onResolver, size = "md", align = "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const compact = size === "sm";

  useEffect(() => {
    function onClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: compact ? "4px" : "6px",
          fontSize: compact ? "12px" : "13px", fontWeight: 600, color: "#047857",
          background: "rgba(4,120,87,0.08)", border: "none", borderRadius: "20px",
          padding: compact ? "5px 10px" : "8px 18px", cursor: "pointer", fontFamily: "inherit",
        }}
      >
        <CheckCircle size={compact ? 12 : 14} />
        Resolver
        <ChevronDown size={compact ? 11 : 13} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", [align]: 0, zIndex: 50,
          width: "250px", background: "#FFFFFF", borderRadius: "14px",
          boxShadow: "0 16px 40px rgba(15,23,42,0.18)", overflow: "hidden",
          animation: "fade-in-up 0.15s ease-out",
        }}>
          <div style={{ padding: "10px 14px 6px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Qual ação foi tomada?
          </div>
          {ACOES.map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.id}
                onClick={() => { setOpen(false); onResolver(a.id); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 14px", border: "none", background: "transparent",
                  color: "#0F172A", fontSize: "13px", cursor: "pointer", fontFamily: "inherit",
                  textAlign: "left", transition: "background 0.12s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <Icon size={14} color="#047857" style={{ flexShrink: 0 }} />
                {a.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
