import { Router } from "express"
import { SaleController } from "../controllers/SaleController"

const saleRoutes = Router()

const saleController = new SaleController()

saleRoutes.post("/sales", saleController.create)

export { saleRoutes }
