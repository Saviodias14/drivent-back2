import { authenticateToken, validateBody } from "@/middlewares";
import * as controller from "@/controllers/payments-controller"
import { Router } from "express";
import { paymentSchema } from "@/schemas";

const paymentsRouter = Router()

paymentsRouter.get("/", authenticateToken, controller.getPayment)
paymentsRouter.post("/process", authenticateToken, validateBody(paymentSchema), controller.postPayment)

export { paymentsRouter }