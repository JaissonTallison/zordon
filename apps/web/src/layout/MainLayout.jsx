import { Outlet } from "react-router-dom";
import NavigationRail from "../components/layout/NavigationRail";
import UserInfo from "../components/layout/UserInfo";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-snow">

      {/* NAV */}
      <NavigationRail />

      {/* CONTEÚDO */}
      <div className="flex-1 overflow-y-auto">

        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">

          {/* LADO ESQUERDO */}
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-textPrimary">
              ZORDON
            </h1>

            <span className="text-xs text-textSecondary">
              Sistema de decisão inteligente
            </span>
          </div>

          {/* LADO DIREITO (USER) */}
          <UserInfo />

        </header>

        {/* PÁGINA */}
        <main className="p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}