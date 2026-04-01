import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    nome: "Usuário",
    email: "user@email.com"
  });

  const [empresa, setEmpresa] = useState({
    nome: "Minha Empresa",
    id: "EMP-001"
  });

  const [webhook, setWebhook] = useState("");
  const [engineAtiva, setEngineAtiva] = useState(true);

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-textPrimary">
          Configurações
        </h1>
        <p className="text-textSecondary">
          Gerencie seu sistema e preferências
        </p>
      </div>

      {/* 👤 CONTA */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
        <h2 className="font-semibold text-textPrimary">
          Conta
        </h2>

        <input
          className="w-full border rounded-lg p-2"
          value={user.nome}
          onChange={(e) =>
            setUser({ ...user, nome: e.target.value })
          }
        />

        <input
          className="w-full border rounded-lg p-2"
          value={user.email}
          onChange={(e) =>
            setUser({ ...user, email: e.target.value })
          }
        />

        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">
          Salvar
        </button>
      </div>

      {/* 🏢 EMPRESA */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
        <h2 className="font-semibold text-textPrimary">
          Empresa
        </h2>

        <input
          className="w-full border rounded-lg p-2"
          value={empresa.nome}
          onChange={(e) =>
            setEmpresa({ ...empresa, nome: e.target.value })
          }
        />

        <div className="text-sm text-textSecondary">
          ID: {empresa.id}
        </div>
      </div>

      {/* 🔔 NOTIFICAÇÕES */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
        <h2 className="font-semibold text-textPrimary">
          Notificações
        </h2>

        <input
          className="w-full border rounded-lg p-2"
          placeholder="Webhook URL"
          value={webhook}
          onChange={(e) => setWebhook(e.target.value)}
        />

        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">
          Salvar webhook
        </button>
      </div>

      {/* 🧠 ENGINE */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
        <h2 className="font-semibold text-textPrimary">
          Motor Zordon
        </h2>

        <div className="flex items-center justify-between">
          <span className="text-textPrimary">
            Execução automática
          </span>

          <input
            type="checkbox"
            checked={engineAtiva}
            onChange={() => setEngineAtiva(!engineAtiva)}
          />
        </div>
      </div>

      {/* 🔐 SEGURANÇA */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
        <h2 className="font-semibold text-textPrimary">
          Segurança
        </h2>

        <button
          onClick={logout}
          className="text-red-500"
        >
          Sair do sistema
        </button>
      </div>

    </div>
  );
}