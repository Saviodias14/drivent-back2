import { authenticateToken, validateBody } from "@/middlewares";
import { Router } from "express";
import * as controller from "@/controllers/tickets-controller"
import { createTicketSchema } from "@/schemas/ticket-schema";

const ticketsRouter = Router()

ticketsRouter.get("/types", authenticateToken, controller.getTicketsType)
ticketsRouter.get("/", authenticateToken, controller.getTickets)
ticketsRouter.post("/", authenticateToken,validateBody(createTicketSchema), controller.postTicket)

export { ticketsRouter }