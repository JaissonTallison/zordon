import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layout/MainLayout";

// PÁGINAS
import Home from "./pages/Home";
import Decisions from "./pages/Decisions";
import Products from "./pages/Products";
import Impact from "./pages/Impact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Intelligence from "./pages/Intelligence";
import Settings from "./pages/Setting";

/**
 *  PROTEÇÃO DE ROTAS
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

        {/*  PÚBLICAS */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/*  PRIVADAS */}
        <Route element={<ProtectedLayout />}>

          <Route index element={<Home />} />
          <Route path="decisions" element={<Decisions />} />
          <Route path="produtos" element={<Products />} />
          <Route path="impacto" element={<Impact />} />
          <Route path="inteligencia" element={<Intelligence />} />
          <Route path="configuracoes" element={<Settings />} />


        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}