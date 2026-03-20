import { useState } from "react"
import { api } from "../api/api"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../styles/auth.css"

interface LoginResponse {
  user: {
    id: string
    name: string
    email: string
  }
  token: string
}

export function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleLogin() {
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password
      })

      console.log("SUCESSO:", response.data)

      const { token } = response.data

      if (!token) {
        throw new Error("Token não recebido")
      }

      localStorage.setItem("token", token)

      navigate("/dashboard")

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("ERRO AXIOS:", error.response?.data)
      } else if (error instanceof Error) {
        console.error("ERRO:", error.message)
      } else {
        console.error("ERRO DESCONHECIDO:", error)
      }

      alert("Login inválido")
    }
  }

  return (
  <div className="auth-page">
    <div className="auth-card">

      <h1>ZORDON</h1>
      <p>Faça login na sua conta</p>

      <input
        type="email"
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

      <button onClick={handleLogin}>
        Entrar
      </button>

      <span onClick={() => navigate("/register")}>
        Não tem conta? Criar agora
      </span>

    </div>
  </div>
)
}