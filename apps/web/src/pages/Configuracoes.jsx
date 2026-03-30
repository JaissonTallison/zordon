import { useState } from "react";

export default function Configuracoes() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleSalvarPerfil() {
    console.log("Salvar perfil", { nome, email });
  }

  function handleAlterarSenha() {
    console.log("Alterar senha", senha);
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">
          Configurações
        </h1>
        <p className="text-textSecondary">
          Gerencie suas preferências e dados do sistema
        </p>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* PERFIL */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">

          <h2 className="text-lg font-semibold">
            Perfil
          </h2>

          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border rounded-lg p-2"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-2"
          />

          <button
            onClick={handleSalvarPerfil}
            className="bg-zordon-accent text-white px-4 py-2 rounded-lg"
          >
            Salvar
          </button>

        </div>

        {/* SEGURANÇA */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">

          <h2 className="text-lg font-semibold">
            Segurança
          </h2>

          <input
            type="password"
            placeholder="Nova senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full border rounded-lg p-2"
          />

          <button
            onClick={handleAlterarSenha}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Alterar senha
          </button>

        </div>

        {/* EMPRESA */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">

          <h2 className="text-lg font-semibold">
            Empresa
          </h2>

          <p className="text-sm text-gray-500">
            Configurações da empresa (em breve)
          </p>

        </div>

        {/* SISTEMA */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">

          <h2 className="text-lg font-semibold">
            Sistema Zordon
          </h2>

          <label className="flex items-center gap-3">
            <input type="checkbox" />
            <span>Modo automático</span>
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" />
            <span>Ativar recomendações</span>
          </label>

        </div>

      </div>

    </div>
  );
}