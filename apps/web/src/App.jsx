import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Decisions from "./pages/Decisions";
import Produtos from "./pages/Produtos";
import Relatorios from "./pages/Relatorios";
import Usuarios from "./pages/Usuarios";
import Login from "./pages/Login";
import Configuracoes from "./pages/Configuracoes";

import MainLayout from "./layout/MainLayout";

/**
 *  PROTECTED LAYOUT (PROFISSIONAL)
 */
function ProtectedLayout() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* PRIVATE */}
        <Route element={<ProtectedLayout />}>

          <Route path="/" element={<Dashboard />} />
          <Route path="/decisions" element={<Decisions />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/usuarios" element={<Usuarios />} />
         <Route path="/configuracoes" element={<Configuracoes />} />

        </Route>

        {/* FALLBACK GLOBAL */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}