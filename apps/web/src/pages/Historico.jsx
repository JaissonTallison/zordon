import { useEffect } from "react";
import { useDecisionStore } from "../store/useDecisionStore";

export default function Historico() {
  const { decisions, fetchDecisions } = useDecisionStore();

  useEffect(() => {
    fetchDecisions();
  }, [fetchDecisions]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Histórico</h1>

      {decisions.map((d, i) => (
        <div key={i} className="bg-white p-4 rounded border">
          <p className="text-sm text-gray-500">
            {new Date(d.gerado_em).toLocaleString()}
          </p>

          <h2 className="font-semibold">{d.titulo}</h2>
          <p>{d.descricao}</p>
        </div>
      ))}
    </div>
  );
}