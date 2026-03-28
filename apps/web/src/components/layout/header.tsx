"use client";

export function Header() {
  return (
    <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950">

      {/* Título */}
      <h1 className="text-lg font-semibold">Dashboard</h1>

      {/* Ações / Usuário */}
      <div className="flex items-center gap-4">

        {/* Notificação */}
        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
          
        </div>

        {/* Usuário */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
            G
          </div>

          <span className="text-sm text-zinc-300">Gestor</span>
        </div>

      </div>
    </header>
  );
}