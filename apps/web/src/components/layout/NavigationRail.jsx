import {
  LayoutDashboard,
  Zap,
  Brain,
  Package,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

export default function NavigationRail() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { id: "home", icon: LayoutDashboard, path: "/" },
    { id: "decisions", icon: Zap, path: "/decisions" },
    { id: "inteligencia", icon: Brain, path: "/inteligencia" },
    { id: "produtos", icon: Package, path: "/produtos" },
    { id: "impacto", icon: BarChart3, path: "/impacto" },
    { id: "config", icon: Settings, path: "/configuracoes" }
  ];

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col justify-between py-4">

      {/* MENU SUPERIOR */}
      <div className="flex flex-col items-center gap-4">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`p-3 rounded-xl transition
                ${isActive
                  ? "bg-purple-100 text-purple-600"
                  : "text-gray-500 hover:bg-gray-100"}
              `}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>

      {/* LOGOUT (RODAPÉ) */}
      <div className="flex flex-col items-center gap-2">

        <div className="w-8 h-px bg-gray-200"></div>

        <button
          onClick={handleLogout}
          className="p-3 rounded-xl text-gray-500 hover:bg-red-100 hover:text-red-500 transition"
          title="Sair"
        >
          <LogOut size={20} />
        </button>

      </div>
    </div>
  );
}