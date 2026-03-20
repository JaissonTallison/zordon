import { useNavigate } from "react-router-dom"
import { logout } from "../utils/auth"
import "./Sidebar.css"

export function Sidebar() {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/")
  }

  return (
    <div className="sidebar">
      <div>
        <h2>ZORDON</h2>

        <div className="menu">
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/products")}>Produtos</button>
          <button onClick={() => navigate("/sales")}>Vendas</button>
          <button onClick={() => navigate("/insights")}>Insights</button>
        </div>
      </div>

      <button className="logout" onClick={handleLogout}>
        Sair
      </button>
    </div>
  )
}