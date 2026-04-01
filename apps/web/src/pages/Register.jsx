import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    empresa_nome: ""
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setErro("");

      // 🔥 REGISTRA NO BACKEND
      await api.post("/auth/register", form);

      // 🔥 REDIRECIONA PARA LOGIN (SEM AUTO LOGIN)
      navigate("/login");

    } catch (err) {
      console.error(err);

      setErro(
        err.response?.data?.erro ||
        "Erro ao criar conta"
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* LEFT */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-zordon-dark via-zordon-mid to-zordon-primary text-white p-12 flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold">ZORDON</h1>
          <p className="text-sm text-gray-300 mt-2">
            Motor de decisão inteligente
          </p>
        </div>

        <div>
          <h2 className="text-4xl font-bold leading-tight">
            Comece a tomar decisões inteligentes hoje
          </h2>

          <p className="mt-4 text-gray-300">
            Crie sua conta e deixe o sistema identificar oportunidades automaticamente.
          </p>
        </div>

        <div className="text-sm text-gray-400">
          © 2026 Zordon Intelligence
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-zordon-light">

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-8"
        >

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-textPrimary">
              Criar conta
            </h2>
            <p className="text-sm text-textSecondary">
              Configure seu ambiente inicial
            </p>
          </div>

          <div className="space-y-4">

            <input
              name="nome"
              placeholder="Nome"
              value={form.nome}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300"
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300"
            />

            <input
              name="senha"
              type="password"
              placeholder="Senha"
              value={form.senha}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300"
            />

            <input
              name="empresa_nome"
              placeholder="Nome da empresa"
              value={form.empresa_nome}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300"
            />

            {erro && (
              <div className="bg-red-100 text-red-600 p-2 rounded text-sm">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-lg text-white font-semibold ${
                loading
                  ? "bg-gray-400"
                  : "bg-zordon-primary hover:bg-zordon-accent"
              }`}
            >
              {loading ? "Criando..." : "Criar conta"}
            </button>

          </div>

          <div className="mt-6 text-sm text-center">
            Já tem conta?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-zordon-accent cursor-pointer"
            >
              Entrar
            </span>
          </div>

        </form>

      </div>
    </div>
  );
}