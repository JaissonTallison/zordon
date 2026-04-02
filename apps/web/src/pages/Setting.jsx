import { useState } from "react";


export default function Settings() {


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



  return (
    <div className="space-y-8">

      {/*  HEADER COM DESTAQUE */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold">
           Configurações do Sistema
        </h1>
        <p className="text-sm opacity-80 mt-1">
          Controle completo do ZORDON e preferências da sua operação
        </p>
      </div>

      {/*  CONTA */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">

        <h2 className="font-semibold text-textPrimary">
           Conta
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <input
            className="border rounded-lg p-2"
            placeholder="Nome"
            value={user.nome}
            onChange={(e) =>
              setUser({ ...user, nome: e.target.value })
            }
          />

          <input
            className="border rounded-lg p-2"
            placeholder="Email"
            value={user.email}
            onChange={(e) =>
              setUser({ ...user, email: e.target.value })
            }
          />

        </div>

        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
          Salvar alterações
        </button>

      </div>

      {/*  EMPRESA */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">

        <h2 className="font-semibold text-textPrimary">
           Empresa
        </h2>

        <input
          className="w-full border rounded-lg p-2"
          placeholder="Nome da empresa"
          value={empresa.nome}
          onChange={(e) =>
            setEmpresa({ ...empresa, nome: e.target.value })
          }
        />

        <div className="text-sm text-textSecondary">
          ID da empresa: <span className="font-medium">{empresa.id}</span>
        </div>

      </div>

      {/*  INTEGRAÇÕES */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">

        <h2 className="font-semibold text-textPrimary">
           Integrações / Webhook
        </h2>

        <input
          className="w-full border rounded-lg p-2"
          placeholder="https://sua-api.com/webhook"
          value={webhook}
          onChange={(e) => setWebhook(e.target.value)}
        />

        <p className="text-xs text-textSecondary">
          Receba eventos do ZORDON em tempo real (alertas, decisões, etc.)
        </p>

        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
          Salvar webhook
        </button>

      </div>

      {/*  ENGINE */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">

        <h2 className="font-semibold text-textPrimary">
           Motor ZORDON
        </h2>

        <div className="flex items-center justify-between">

          <div>
            <p className="text-textPrimary font-medium">
              Execução automática
            </p>

            <p className="text-xs text-textSecondary">
              O sistema roda análises automaticamente
            </p>
          </div>

          <button
            onClick={() => setEngineAtiva(!engineAtiva)}
            className={`px-4 py-2 rounded-lg text-white text-sm ${
              engineAtiva
                ? "bg-green-600"
                : "bg-gray-400"
            }`}
          >
            {engineAtiva ? "Ativo" : "Desativado"}
          </button>

        </div>

      </div>

      {/*  CONFIG AVANÇADA (PRONTO PRA EVOLUIR) */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">

        <h2 className="font-semibold text-textPrimary">
           Configurações avançadas
        </h2>

        <div className="text-sm text-textSecondary">
          Em breve:
        </div>

        <ul className="text-sm text-textSecondary space-y-1">
          <li>• Ajuste de sensibilidade das regras</li>
          <li>• Personalização de alertas</li>
          <li>• Configuração de prioridades</li>
        </ul>

      </div>

    </div>
  );
}