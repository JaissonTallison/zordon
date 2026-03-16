import { Router } from "express"
import { SaleController } from "../controllers/SaleController"

const saleRoutes = Router()

const saleController = new SaleController()

saleRoutes.get("/sales", (req, res) => {
  return saleController.list(req, res)
})

export { saleRoutes }