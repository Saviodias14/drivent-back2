import { authenticateToken } from "@/middlewares";
import { Router } from "express";
import * as controller from "@/controllers/tickets-controller"

const ticketsRouter = Router()

ticketsRouter.get("/types", authenticateToken, controller.getTicketsType)
ticketsRouter.get("/", authenticateToken, controller.getTickets)

export { ticketsRouter }