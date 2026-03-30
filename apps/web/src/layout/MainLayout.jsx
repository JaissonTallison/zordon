import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Zap
} from "lucide-react";

import { Outlet, NavLink } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();

  return (
    <div className="flex h-screen bg-zordon-light">

      {/* SIDEBAR */}
      <aside
        className={`bg-gradient-to-b from-zordon-dark via-zordon-mid to-zordon-primary text-white transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } flex flex-col`}
      >

        {/* HEADER */}
        <div className="flex items-center justify-between p-4">
          {!collapsed && (
            <h1 className="text-lg font-bold">ZORDON</h1>
          )}

          <button onClick={() => setCollapsed(!collapsed)}>
            <Menu size={20} />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-2 space-y-2">

          <MenuItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" collapsed={collapsed} />

          <MenuItem to="/decisions" icon={<Zap size={18} />} label="Decisões" collapsed={collapsed} />

          <MenuItem to="/produtos" icon={<Package size={18} />} label="Produtos" collapsed={collapsed} />

          <MenuItem to="/relatorios" icon={<BarChart3 size={18} />} label="Relatórios" collapsed={collapsed} />

          <MenuItem to="/usuarios" icon={<Users size={18} />} label="Usuários" collapsed={collapsed} />

          <MenuItem to="/configuracoes" icon={<Settings size={18} />} label="Configurações" collapsed={collapsed} />

        </nav>

        {/* USER */}
        <div className="p-4 border-t border-white/10">

          {!collapsed ? (
            <div className="flex items-center justify-between">

              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {user?.nome || "Usuário"}
                </span>
                <span className="text-xs text-white/60">
                  {user?.role || "Perfil"}
                </span>
              </div>

              <button
                onClick={logout}
                className="text-white/60 hover:text-red-400 transition"
              >
                <LogOut size={16} />
              </button>

            </div>
          ) : (
            <button
              onClick={logout}
              className="w-full flex justify-center text-white/60 hover:text-red-400"
            >
              <LogOut size={18} />
            </button>
          )}

        </div>

      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>

    </div>
  );
}

/**
 * MENU ITEM
 */
function MenuItem({ icon, label, to, collapsed }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
          isActive
            ? "bg-zordon-accent shadow-lg"
            : "hover:bg-white/10"
        }`
      }
    >
      {icon}
      {!collapsed && <span className="text-sm">{label}</span>}
    </NavLink>
  );
}