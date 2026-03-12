import express from "express"
import { productRoutes } from "./modules/products/routes/product.routes"

const app = express()

app.use(express.json())

app.use(productRoutes)

app.get("/", (req, res) => {
  return res.json({
    message: "ZORDON API running"
  })
})

const PORT = 3333

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
