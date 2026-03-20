import { useState } from "react"
import { api } from "../api/api"
import { useNavigate } from "react-router-dom"
import "../styles/auth.css"

export function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    try {
      setLoading(true)

      await api.post("/auth/register", {
        name,
        email,
        password
      })

      alert("Conta criada com sucesso!")
      navigate("/")

    } catch (error: unknown) {
      console.error("Erro ao cadastrar:", error)
      alert("Erro ao cadastrar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>ZORDON</h1>
        <p>Crie sua conta</p>

        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Criando..." : "Cadastrar"}
        </button>

        <span onClick={() => navigate("/")}>
          Já tem conta? Fazer login
        </span>

      </div>
    </div>
  )
}