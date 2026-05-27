import { useState } from "react";
import { User, Building2, Webhook, Cpu, Shield, ChevronRight } from "lucide-react";

const C = {
  card:    "#10141F",
  border:  "rgba(255,255,255,0.07)",
  t1:      "#F0F4FF",
  t2:      "#9BA8C0",
  t3:      "#5A6480",
  t4:      "#2E3550",
  brand:   "#0085E2",
  brandLt: "#38BDFF",
  brandBg: "rgba(0,133,226,0.08)",
  brandBdr:"rgba(0,133,226,0.4)",
  green:   "#34D399",
  amber:   "#FBBF24",
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
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "660px", animation: "fade-in-up 0.35s ease-out" }}>

      <Section icon={User} title="Conta" sub="Informações do seu perfil" accent={C.brand}>
        <Row2>
          <Field label="Nome"> <DInput value={user.nome}  ph="Seu nome"       onChange={(e) => setUser({ ...user, nome: e.target.value })} /></Field>
          <Field label="Email"><DInput value={user.email} ph="seu@email.com"  type="email" onChange={(e) => setUser({ ...user, email: e.target.value })} /></Field>
        </Row2>
        <SaveBtn onClick={handleSave} saved={saved} label="Salvar perfil" color={C.brand} />
      </Section>

      <Section icon={Building2} title="Empresa" sub="Configuração da organização" accent={C.brandLt}>
        <Field label="Nome da empresa"><DInput value={empresa.nome} ph="Nome" onChange={(e) => setEmpresa({ ...empresa, nome: e.target.value })} /></Field>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "11px", color: C.t3 }}>ID:</span>
          <code style={{ fontSize: "12px", color: C.brandLt, fontFamily: "'JetBrains Mono',monospace", background: "rgba(56,189,255,0.07)", padding: "2px 8px", borderRadius: "4px" }}>{empresa.id}</code>
        </div>
      </Section>

      <Section icon={Webhook} title="Integrações & Webhook" sub="Receba eventos em tempo real" accent={C.amber}>
        <Field label="URL do Webhook"><DInput value={webhook} ph="https://sua-api.com/webhook" onChange={(e) => setWebhook(e.target.value)} /></Field>
        <p style={{ fontSize: "11px", color: C.t4 }}>
          Eventos: <span style={{ color: C.amber }}>decisão_criada · alerta_gerado · status_atualizado</span>
        </p>
        <SaveBtn onClick={handleSave} saved={saved} label="Salvar webhook" color={C.amber} />
      </Section>

      <Section icon={Cpu} title="Motor ZORDON" sub="Controle da engine de decisão" accent={C.green}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", borderRadius: "8px", transition: "all 0.2s",
          background: engineOn ? "rgba(52,211,153,0.05)" : "rgba(16,20,31,0.5)",
          border: `1px solid ${engineOn ? "rgba(52,211,153,0.2)" : C.border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: engineOn ? C.green : C.t4, boxShadow: engineOn ? "0 0 7px rgba(52,211,153,0.8)" : "none", transition: "all 0.2s" }} />
            <div>
              <p style={{ fontSize: "13px", fontWeight: 500, color: C.t1 }}>Execução automática</p>
              <p style={{ fontSize: "11px", color: C.t3 }}>{engineOn ? "Analisando dados continuamente" : "Engine desativada"}</p>
            </div>
          </div>
          <button onClick={() => setEngineOn(!engineOn)} style={{
            padding: "5px 14px", borderRadius: "6px", fontSize: "12px",
            fontFamily: "inherit", cursor: "pointer", fontWeight: 600, transition: "all 0.2s",
            background: engineOn ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${engineOn ? "rgba(52,211,153,0.3)" : C.border}`,
            color: engineOn ? C.green : C.t3,
          }}>
            {engineOn ? "Ativo" : "Inativo"}
          </button>
        </div>
      </Section>

      <Section icon={Shield} title="Configurações avançadas" sub="Em desenvolvimento" accent={C.t3}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {[
            "Ajuste de sensibilidade das regras de negócio",
            "Personalização de limites de alerta por produto",
            "Configuração de prioridades por empresa",
            "Gestão de usuários e permissões",
            "Exportação de dados e relatórios",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: "7px", border: `1px solid ${C.border}`, opacity: 0.45 }}>
              <span style={{ fontSize: "12px", color: C.t2 }}>{item}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ fontSize: "10px", color: C.t4 }}>em breve</span>
                <ChevronRight size={11} color={C.t4} />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ icon: Icon, title, sub, accent, children }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "18px 20px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, ${accent}, transparent)` }} />
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: `${accent}10`, border: `1px solid ${accent}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={14} color={accent} />
        </div>
        <div>
          <p style={{ fontSize: "13px", fontWeight: 600, color: C.t1, lineHeight: 1.2 }}>{title}</p>
          <p style={{ fontSize: "11px", color: C.t3 }}>{sub}</p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>{children}</div>
    </div>
  );
}

function Row2({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>{children}</div>;
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "10px", color: C.t3, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "5px" }}>{label}</label>
      {children}
    </div>
  );
}

function DInput({ value, onChange, ph, type = "text" }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={ph}
      style={{ width: "100%", padding: "8px 12px", borderRadius: "7px", background: "#141926", border: `1px solid ${C.border}`, color: C.t1, fontSize: "13px", outline: "none", fontFamily: "inherit", transition: "border-color 0.2s" }}
      onFocus={(e) => (e.target.style.borderColor = "rgba(0,133,226,0.4)")}
      onBlur={(e)  => (e.target.style.borderColor = C.border)}
    />
  );
}

function SaveBtn({ onClick, saved, label, color }) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 16px", borderRadius: "7px", fontSize: "12px",
      fontFamily: "inherit", cursor: "pointer", fontWeight: 600, transition: "all 0.2s",
      background: saved ? "rgba(52,211,153,0.1)"        : `${color}0D`,
      border:     saved ? "1px solid rgba(52,211,153,0.3)" : `1px solid ${color}25`,
      color:      saved ? C.green : color,
    }}>
      {saved ? "✓ Salvo!" : label}
    </button>
  );
}
