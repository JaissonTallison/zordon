import { useEffect, useState } from "react"
import { api } from "../api/api"
import { MetricCard } from "../components/MetricCard"
import { SalesChart } from "../components/SalesChart"
import "./Dashboard.css"

type DashboardData = {
  totalProducts: number
  totalSales: number
  totalRevenue: number
  topProduct: string
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")

    async function loadDashboard() {
      try {
        const res = await api.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        setData(res.data)
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error)
      }
    }

    loadDashboard()
  }, [])

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {data && (
        <>
          {/* CARDS */}
          <div className="metrics">
            <MetricCard
              title="Total Products"
              value={data.totalProducts}
            />

            <MetricCard
              title="Total Sales"
              value={data.totalSales}
            />

            <MetricCard
              title="Total Revenue"
              value={`$ ${data.totalRevenue}`}
            />

            <MetricCard
              title="Top Product"
              value={data.topProduct}
            />
          </div>

          {/* GRÁFICO */}
          <div className="chart-container">
            <SalesChart
              labels={["Products", "Sales", "Revenue"]}
              values={[
                data.totalProducts,
                data.totalSales,
                data.totalRevenue
              ]}
            />
          </div>
        </>
      )}
    </div>
  )
}