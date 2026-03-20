import express from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express"

import { swaggerSpec } from "./docs/swagger"

import { productRoutes } from "./modules/products/routes/product.routes"
import { saleRoutes } from "./modules/sales/routes/sale.routes"
import { dashboardRoutes } from "./modules/dashboard/routes/dashboard.routes"
import { authRoutes } from "./modules/auth/routes/auth.routes"
import { insightsRoutes } from "./modules/insights/routes/insights.routes"

const app = express()

app.use(cors({
  origin: "http://localhost:5173"
}))

app.use(express.json())

app.use(authRoutes)
app.use(productRoutes)
app.use(saleRoutes)
app.use(insightsRoutes)
app.use(dashboardRoutes)

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get("/", (req, res) => {
  return res.json({
    message: "ZORDON API running"
  })
})

const PORT = 3333

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})