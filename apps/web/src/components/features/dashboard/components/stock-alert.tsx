type StockAlertProps = {
  produto: string;
  estoque: number;
  minimo: number;
};

export function StockAlert({ produto, estoque, minimo }: StockAlertProps) {
  const diferenca = estoque - minimo;

  let prioridade = "";
  let cor = "";
  let recomendacao = "";

  //  Lógica inteligente
  if (estoque <= minimo) {
    prioridade = "ALTA";
    cor = "bg-red-500/10 border-red-500/30 text-red-400";
    recomendacao = "Repor estoque com urgência";
  } else if (diferenca <= 5) {
    prioridade = "MÉDIA";
    cor = "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
    recomendacao = "Atenção: estoque próximo do mínimo";
  } else {
    prioridade = "OK";
    cor = "bg-zinc-900 border-zinc-800 text-green-400";
    recomendacao = "Estoque saudável";
  }

  return (
    <div
      className={`p-4 rounded-xl border flex flex-col gap-3 transition hover:scale-[1.01] ${cor}`}
    >
      {/* TOPO */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-white">{produto}</h3>
          <p className="text-sm text-zinc-400">
            Mínimo: {minimo} un
          </p>
        </div>

        <span className="text-sm font-semibold">
          {estoque} un
        </span>
      </div>

      {/* PRIORIDADE */}
      <div className="flex items-center justify-between text-xs">

        <span className="px-2 py-1 rounded-full bg-black/30">
          Prioridade: {prioridade}
        </span>

        {/*  RECOMENDAÇÃO */}
        <span className="opacity-80">
          💡 {recomendacao}
        </span>

      </div>
    </div>
  );
}