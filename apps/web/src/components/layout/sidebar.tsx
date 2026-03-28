"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  function isActive(path: string) {
    return pathname === path;
  }

  return (
    <aside className="w-64 h-screen bg-zinc-950 border-r border-zinc-800 p-6">

      {/* Logo */}
      <h2 className="text-2xl font-bold mb-8">ZORDON</h2>

      {/* Menu */}
      <nav className="space-y-2">

        <Link
          href="/dashboard"
          className={`block px-4 py-2 rounded-lg ${
            isActive("/dashboard")
              ? "bg-purple-600 text-white"
              : "text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          Dashboard
        </Link>

        <Link
          href="/produtos"
          className={`block px-4 py-2 rounded-lg ${
            isActive("/produtos")
              ? "bg-purple-600 text-white"
              : "text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          Produtos
        </Link>

        <Link
          href="/vendas"
          className={`block px-4 py-2 rounded-lg ${
            isActive("/vendas")
              ? "bg-purple-600 text-white"
              : "text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          Vendas
        </Link>

        <Link
          href="/insights"
          className={`block px-4 py-2 rounded-lg ${
            isActive("/insights")
              ? "bg-purple-600 text-white"
              : "text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          Insights
        </Link>

        <Link
          href="/relatorios"
          className={`block px-4 py-2 rounded-lg ${
            isActive("/relatorios")
              ? "bg-purple-600 text-white"
              : "text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          Relatórios
        </Link>

      </nav>
    </aside>
  );
}