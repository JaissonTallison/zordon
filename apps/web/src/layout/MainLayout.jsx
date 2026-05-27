import { Outlet, useLocation } from "react-router-dom";
import NavigationRail from "../components/layout/NavigationRail";
import TopBar from "../components/layout/TopBar";

const PAGE_TITLES = {
  "/":              { label: "Dashboard",          sub: "Centro de comando operacional",       path: "/"              },
  "/decisions":     { label: "Decisões",           sub: "Inteligência priorizada por impacto", path: "/decisions"     },
  "/inteligencia":  { label: "Inteligência",       sub: "Análise estratégica do sistema",      path: "/inteligencia"  },
  "/produtos":      { label: "Produtos",           sub: "Base operacional e estoque",          path: "/produtos"      },
  "/impacto":       { label: "Impacto Financeiro", sub: "Onde você perde e ganha dinheiro",    path: "/impacto"       },
  "/regras":        { label: "Regras",             sub: "Motor de regras dinâmicas",           path: "/regras"        },
  "/configuracoes": { label: "Configurações",      sub: "Controle e preferências do sistema",  path: "/configuracoes" },
};

export default function MainLayout() {
  const location = useLocation();
  const page = PAGE_TITLES[location.pathname] || { label: "ZORDON", sub: "", path: location.pathname };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      overflow: "hidden",
      background: "var(--page-bg)",
    }}>
      <NavigationRail />

      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minWidth: 0,
      }}>
        <TopBar page={page} />

        <main
          className="flex-1 overflow-y-auto bg-grid"
          style={{ padding: "24px" }}
          key={location.pathname}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
