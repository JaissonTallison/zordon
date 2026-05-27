export default function UserInfo() {
  const user = JSON.parse(localStorage.getItem("user")) || { nome: "Usuário", role: "ADMIN" };
  const initials = user?.nome?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "ZD";

  const roleColor = user?.role === "ADMIN"
    ? { text: "#818CF8", bg: "rgba(129,140,248,0.08)", border: "rgba(129,140,248,0.2)" }
    : { text: "#34D399",  bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.2)"  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      {/* STATUS */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span className="status-dot status-dot-active" />
        <span style={{ fontSize: "11px", color: "#52525B" }}>sistema ativo</span>
      </div>

      <div style={{ width: "1px", height: "18px", background: "#3D3D44" }} />

      {/* USER CHIP */}
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "6px 12px", borderRadius: "8px",
        background: roleColor.bg, border: `1px solid ${roleColor.border}`,
      }}>
        <div style={{
          width: "26px", height: "26px", borderRadius: "6px",
          background: "rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "11px", fontWeight: 600, color: roleColor.text,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {initials}
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
          <span style={{ fontSize: "12px", fontWeight: 500, color: "#F4F4F5", maxWidth: "100px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
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
