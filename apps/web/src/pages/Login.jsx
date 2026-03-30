import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); 

    try {
      setLoading(true);
      setErro("");

      await login(email, senha);

      navigate("/"); 

    } catch (err) {
      console.error(err);
      setErro("Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  };

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
            Transforme dados em decisões com impacto financeiro
          </h2>

          <p className="mt-4 text-gray-300">
            O sistema identifica problemas e aumenta resultados automaticamente.
          </p>
        </div>

        <div className="text-sm text-gray-400">
          © 2026 Zordon Intelligence
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-zordon-light">

        <form
          onSubmit={handleLogin}
          className="w-full max-w-md p-8"
        >

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-textPrimary">
              Acessar sistema
            </h2>
            <p className="text-sm text-textSecondary">
              Entre com sua conta para continuar
            </p>
          </div>

          <div className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300"
            />

            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300"
            />

            {erro && (
              <div className="bg-red-100 text-red-600 p-2 rounded text-sm">
                {erro}
              </div>
            )}

            <button
              type="submit" // IMPORTANTE
              disabled={loading}
              className={`w-full p-3 rounded-lg text-white font-semibold ${
                loading
                  ? "bg-gray-400"
                  : "bg-zordon-primary hover:bg-zordon-accent"
              }`}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

          </div>

          <div className="mt-6 text-sm text-center">
            Não tem conta?{" "}
            <span className="text-zordon-accent cursor-pointer">
              Criar conta
            </span>
          </div>

        </form>

      </div>
    </div>
  );
}