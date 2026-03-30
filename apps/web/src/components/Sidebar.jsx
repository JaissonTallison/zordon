import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
  Menu,
  Zap
} from "lucide-react";

import { NavLink } from "react-router-dom"; // 🔥 IMPORTANTE

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  const [openMobile, setOpenMobile] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed);
  }, [collapsed]);

  // ROTAS
 const menu = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { id: "decisions", label: "Decisões", icon: Zap, path: "/decisions" },
  { id: "produtos", label: "Produtos", icon: Package, path: "/produtos" },
  { id: "usuarios", label: "Usuários", icon: Users, path: "/usuarios" },
  { id: "relatorios", label: "Relatórios", icon: BarChart3, path: "/relatorios" },
  { id: "configuracoes", label: "Configurações", icon: Settings, path: "/configuracoes" }
];
  return (
    <>
      {/* BOTÃO MOBILE */}
      <button
        onClick={() => setOpenMobile(true)}
        className="md:hidden fixed top-4 left-4 z-[60] bg-zordon-primary text-white p-2 rounded-lg shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* OVERLAY */}
      {openMobile && (
        <div
          onClick={() => setOpenMobile(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
        fixed top-0 left-0 z-50 h-screen flex flex-col text-white
        bg-gradient-to-b from-zordon-dark via-zordon-mid to-zordon-primary
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-20" : "w-64"}
        ${openMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4">
          {!collapsed && (
            <span className="text-lg font-bold tracking-wide">
              ZORDON
            </span>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-zordon-accent/30 transition"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 space-y-2 px-2 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.id} className="relative group">
                
                {/* 🔥 NAVLINK NO LUGAR DO BUTTON */}
                <NavLink
                  to={item.path}
                  onClick={() => setOpenMobile(false)}
                  className={({ isActive }) => `
                    w-full flex items-center gap-3 px-3 py-3 rounded-xl
                    transition-all duration-200

                    ${
                      isActive
                        ? "bg-zordon-accent shadow-lg shadow-zordon-accent/30"
                        : "hover:bg-zordon-accent/20"
                    }
                  `}
                >
                  <Icon size={20} />

                  {!collapsed && (
                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  )}
                </NavLink>

                {/* TOOLTIP */}
                {collapsed && (
                  <span
                    className="
                      absolute left-full ml-3 top-1/2 -translate-y-1/2
                      bg-gradient-to-r from-zordon-primary to-zordon-accent
                      text-white text-xs px-3 py-1.5 rounded-lg
                      shadow-lg backdrop-blur-sm
                      opacity-0 group-hover:opacity-100
                      transition-all duration-200 whitespace-nowrap
                    "
                  >
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* PERFIL */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-zordon-accent flex items-center justify-center font-bold shadow-md">
              J
            </div>

            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  Jaisson
                </span>
                <span className="text-xs text-white/60">
                  Gestor
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}