export default function UserInfo() {
  const user = JSON.parse(localStorage.getItem("user")) || { nome: "Usuário", role: "ADMIN" };
  const initials = user?.nome?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "ZD";

  const roleColor = user?.role === "ADMIN"
    ? { text: "#4F46E5", bg: "rgba(79,70,229,0.08)", border: "rgba(79,70,229,0.2)" }
    : { text: "#047857",  bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.2)"  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      {/* STATUS */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span className="status-dot status-dot-active" />
        <span style={{ fontSize: "11px", color: "#64748B" }}>sistema ativo</span>
      </div>

      <div style={{ width: "1px", height: "18px", background: "rgba(0,0,0,0.08)" }} />

      {/* USER CHIP */}
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "6px 12px", borderRadius: "8px",
        background: roleColor.bg, border: `1px solid ${roleColor.border}`,
      }}>
        <div style={{
          width: "26px", height: "26px", borderRadius: "6px",
          background: "rgba(15,23,42,0.05)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "11px", fontWeight: 600, color: roleColor.text,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {initials}
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
          <span style={{ fontSize: "12px", fontWeight: 500, color: "#0F172A", maxWidth: "100px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
            {user?.nome || "Usuário"}
          </span>
          <span style={{ fontSize: "10px", color: roleColor.text }}>
            {user?.role || "ANALISTA"}
          </span>
        </div>
      </div>
    </div>
  );
}
