import { useEffect, useState } from "react";
import api from "../services/api";

export default function Usuarios() {

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  async function carregarUsuarios() {

    try {
      setLoading(true);
      setErro(null);

      const res = await api.get("/users");

  
      const lista = res.data?.data || [];

      setUsuarios(lista);

    } catch (err) {
      console.error("ERRO AO CARREGAR USUÁRIOS:", err);

      setErro(
        err.response?.data?.erro ||
        "Erro ao carregar usuários"
      );

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">
          Usuários
        </h1>
        <p className="text-textSecondary">
          Gerencie os usuários da sua empresa
        </p>
      </div>

      {/* ERRO */}
      {erro && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {erro}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="text-center text-textSecondary">
          Carregando usuários...
        </div>
      )}

      {/* SEM DADOS */}
      {!loading && usuarios.length === 0 && !erro && (
        <div className="text-center text-gray-400">
          Nenhum usuário encontrado
        </div>
      )}

      {/* TABELA */}
      {!loading && usuarios.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-surfaceSoft text-left text-sm text-textSecondary">
              <tr>
                <th className="p-4">Nome</th>
                <th>Email</th>
                <th>Role</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>

              {usuarios.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50 transition">

                  <td className="p-4 font-medium">
                    {u.nome}
                  </td>

                  <td>{u.email}</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        u.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="space-x-2">

                    <button
                      onClick={() => alert(`Alterar role de ${u.nome}`)}
                      className="text-sm px-3 py-1 bg-zordon-accent text-white rounded-lg hover:opacity-90"
                    >
                      Alterar Role
                    </button>

                    <button
                      onClick={() => alert(`Remover ${u.nome}`)}
                      className="text-sm px-3 py-1 bg-red-500 text-white rounded-lg hover:opacity-90"
                    >
                      Remover
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}