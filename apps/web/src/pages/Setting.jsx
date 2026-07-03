import { useState } from "react";
import { User, Building2, Webhook, Cpu, Shield, ChevronRight, Check } from "lucide-react";

const C = {
  card:    "#FFFFFF",
  card2:   "#F8FAFC",
  border:  "rgba(15,23,42,0.05)",
  t1:      "#0F172A",
  t2:      "#475569",
  t3:      "#64748B",
  t4:      "#94A3B8",
  brand:   "#0085E2",
  brandLt: "#38BDFF",
  brandBg: "rgba(0,133,226,0.08)",
  brandBdr:"rgba(0,133,226,0.4)",
  green:   "#047857",
  amber:   "#B45309",
  radius:    "18px",
  radiusSm:  "12px",
  shadow:    "0 1px 2px rgba(15,23,42,0.04), 0 10px 24px rgba(15,23,42,0.06)",
};

export default function Settings() {
  const stored = JSON.parse(localStorage.getItem("user")) || {};
  const [user, setUser]         = useState({ nome: stored.nome || "Usuário", email: stored.email || "" });
  const [empresa, setEmpresa]   = useState({ nome: "Minha Empresa", id: "EMP-001" });
  const [webhook, setWebhook]   = useState("");
  const [engineOn, setEngineOn] = useState(true);
  const [saved, setSaved]       = useState(false);

  function handleSave() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))",
      gap: "16px", alignItems: "start", maxWidth: "1240px",
      animation: "fade-in-up 0.35s ease-out",
    }}>

      <Section icon={User} title="Conta" sub="Informações do seu perfil" accent={C.brand}>
        <Row2>
          <Field label="Nome"> <DInput value={user.nome}  ph="Seu nome"       onChange={(e) => setUser({ ...user, nome: e.target.value })} /></Field>
          <Field label="Email"><DInput value={user.email} ph="seu@email.com"  type="email" onChange={(e) => setUser({ ...user, email: e.target.value })} /></Field>
        </Row2>
        <SaveBtn onClick={handleSave} saved={saved} label="Salvar perfil" color={C.brand} />
      </Section>

      <Section icon={Building2} title="Empresa" sub="Configuração da organização" accent={C.brand}>
        <Field label="Nome da empresa"><DInput value={empresa.nome} ph="Nome" onChange={(e) => setEmpresa({ ...empresa, nome: e.target.value })} /></Field>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "13px", color: C.t3 }}>ID:</span>
          <code style={{ fontSize: "13px", color: C.brand, fontFamily: "'JetBrains Mono',monospace", background: "rgba(0,133,226,0.07)", padding: "3px 9px", borderRadius: "6px" }}>{empresa.id}</code>
        </div>
      </Section>

      <Section icon={Webhook} title="Integrações & Webhook" sub="Receba eventos em tempo real" accent={C.amber}>
        <Field label="URL do Webhook"><DInput value={webhook} ph="https://sua-api.com/webhook" onChange={(e) => setWebhook(e.target.value)} /></Field>
        <p style={{ fontSize: "13px", color: C.t3 }}>
          Eventos: <span style={{ color: C.amber, fontWeight: 600 }}>decisão_criada · alerta_gerado · status_atualizado</span>
        </p>
        <SaveBtn onClick={handleSave} saved={saved} label="Salvar webhook" color={C.amber} />
      </Section>

      <Section icon={Cpu} title="Motor ZORDON" sub="Controle da engine de decisão" accent={C.green}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px", borderRadius: C.radiusSm, transition: "all 0.2s",
          background: engineOn ? "rgba(4,120,87,0.06)" : C.card2,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: engineOn ? C.green : C.t4, boxShadow: engineOn ? "0 0 7px rgba(4,120,87,0.5)" : "none", transition: "all 0.2s" }} />
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600, color: C.t1 }}>Execução automática</p>
              <p style={{ fontSize: "12px", color: C.t3 }}>{engineOn ? "Analisando dados continuamente" : "Engine desativada"}</p>
            </div>
          </div>
          <button onClick={() => setEngineOn(!engineOn)} style={{
            padding: "6px 16px", borderRadius: "20px", fontSize: "13px",
            fontFamily: "inherit", cursor: "pointer", fontWeight: 600, transition: "all 0.2s", border: "none",
            background: engineOn ? "rgba(4,120,87,0.12)" : "rgba(15,23,42,0.05)",
            color: engineOn ? C.green : C.t3,
          }}>
            {engineOn ? "Ativo" : "Inativo"}
          </button>
        </div>
      </Section>

      <div style={{ gridColumn: "1 / -1" }}>
        <Section icon={Shield} title="Configurações avançadas" sub="Em desenvolvimento" accent={C.t3}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "8px" }}>
            {[
              "Ajuste de sensibilidade das regras de negócio",
              "Personalização de limites de alerta por produto",
              "Configuração de prioridades por empresa",
              "Gestão de usuários e permissões",
              "Exportação de dados e relatórios",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderRadius: C.radiusSm, background: C.card2, opacity: 0.6 }}>
                <span style={{ fontSize: "13px", color: C.t2 }}>{item}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                  <span style={{ fontSize: "11px", color: C.t4 }}>em breve</span>
                  <ChevronRight size={12} color={C.t4} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, sub, accent, children }) {
  return (
    <div style={{ background: C.card, borderRadius: C.radius, boxShadow: C.shadow, padding: "22px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: C.radiusSm, flexShrink: 0, background: `${accent}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={16} color={accent} />
        </div>
        <div>
          <p style={{ fontSize: "15px", fontWeight: 700, color: C.t1, lineHeight: 1.25 }}>{title}</p>
          <p style={{ fontSize: "13px", color: C.t3 }}>{sub}</p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>{children}</div>
    </div>
  );
}

function Row2({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>{children}</div>;
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "12px", color: C.t3, fontWeight: 600, marginBottom: "6px" }}>{label}</label>
      {children}
    </div>
  );
}

function DInput({ value, onChange, ph, type = "text" }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={ph}
      style={{ width: "100%", padding: "10px 14px", borderRadius: C.radiusSm, background: C.card2, border: `1px solid ${C.border}`, color: C.t1, fontSize: "14px", outline: "none", fontFamily: "inherit", transition: "border-color 0.2s" }}
      onFocus={(e) => (e.target.style.borderColor = "rgba(0,133,226,0.4)")}
      onBlur={(e)  => (e.target.style.borderColor = C.border)}
    />
  );
}

function SaveBtn({ onClick, saved, label, color }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: "6px", width: "fit-content",
      padding: "9px 18px", borderRadius: "20px", fontSize: "13px",
      fontFamily: "inherit", cursor: "pointer", fontWeight: 600, transition: "all 0.2s", border: "none",
      background: saved ? "rgba(4,120,87,0.12)" : `${color}12`,
      color:      saved ? C.green : color,
    }}>
      {saved && <Check size={14} strokeWidth={2.5} />}
      {saved ? "Salvo!" : label}
    </button>
  );
}
