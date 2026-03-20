import { BrowserRouter, Routes, Route } from "react-router-dom"

import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { Dashboard } from "./pages/Dashboard"
import { Products } from "./pages/Products"
import { Sales } from "./pages/Sales"
import { Insights } from "./pages/Insights"

import { MainLayout } from "./layouts/MainLayout"
import { PrivateRoute } from "./routes/PrivateRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PÚBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PRIVADAS */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/products"
          element={
            <PrivateRoute>
              <MainLayout>
                <Products />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/sales"
          element={
            <PrivateRoute>
              <MainLayout>
                <Sales />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/insights"
          element={
            <PrivateRoute>
              <MainLayout>
                <Insights />
              </MainLayout>
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App