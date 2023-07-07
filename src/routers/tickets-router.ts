import { authenticateToken, validateBody } from "@/middlewares";
import { Router } from "express";
import * as controller from "@/controllers/tickets-controller"
import { createTicketSchema } from "@/schemas/ticket-schema";

const ticketsRouter = Router()
ticketsRouter.use(authenticateToken)

ticketsRouter.get("/types", controller.getTicketsType)
ticketsRouter.get("/", controller.getTickets)
ticketsRouter.post("/", validateBody(createTicketSchema), controller.postTicket)

export { ticketsRouter }