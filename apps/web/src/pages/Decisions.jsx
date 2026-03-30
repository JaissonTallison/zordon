import { useEffect, useState } from "react";
import api from "../services/api";

export default function Decisions() {
  const [decisoes, setDecisoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  async function carregarDecisoes() {
    try {
      setLoading(true);

      console.log("Buscando resultados...");

      const res = await api.get("/resultados");

      console.log("RESPOSTA API:", res.data);

      setDecisoes(res.data || []);
      setErro(null);
    } catch (err) {
      console.error("ERRO:", err);

      if (err.response) {
        setErro(err.response.data.erro || "Erro ao buscar dados");
      } else {
        setErro("Erro de conexão com servidor");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDecisoes();
  }, []);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">
            Decisões
          </h1>
          <p className="text-textSecondary">
            Recomendações geradas pelo Zordon
          </p>
        </div>

        <button
          onClick={carregarDecisoes}
          className="bg-zordon-accent text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          Atualizar
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center text-textSecondary">
          Carregando decisões...
        </div>
      )}

      {/* ERRO */}
      {!loading && erro && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {erro}
        </div>
      )}

      {/* LISTA */}
      {!loading && !erro && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {decisoes.length === 0 && (
            <div className="col-span-full text-center text-textSecondary">
              Nenhuma decisão encontrada
            </div>
          )}

          {decisoes.map((d) => (
            <div
              key={d.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
            >

              {/* TIPO / TÍTULO */}
              <h2 className="font-semibold text-lg text-textPrimary">
                {d.tipo || "Decisão"}
              </h2>

              {/* DESCRIÇÃO */}
              <p className="text-sm text-textSecondary mt-1">
                {d.descricao || "Sem descrição"}
              </p>

              {/* STATUS */}
              <div className="mt-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    d.status === "APROVADO"
                      ? "bg-green-100 text-green-700"
                      : d.status === "REJEITADO"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {d.status || "PENDENTE"}
                </span>
              </div>

              {/* IMPACTO */}
              {d.impacto && (
                <div className="mt-3 text-sm">
                  💰 Impacto estimado:
                  <strong className="ml-1">
                    R$ {Number(d.impacto).toLocaleString("pt-BR")}
                  </strong>
                </div>
              )}

              {/* DATA */}
              {d.criado_em && (
                <div className="mt-2 text-xs text-gray-400">
                  {new Date(d.criado_em).toLocaleString("pt-BR")}
                </div>
              )}

              {/* AÇÕES (futuro) */}
              <div className="flex gap-2 mt-4">

                <button className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:opacity-90">
                  Aprovar
                </button>

                <button className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:opacity-90">
                  Rejeitar
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}