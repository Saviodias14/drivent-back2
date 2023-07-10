import { Request, Response } from "express";
import httpStatus from "http-status";
import * as service from "@/services/tickets-service"
import { AuthenticatedRequest } from "@/middlewares";

export async function getTicketsType(req: Request, res: Response) {
    const result = await service.getTicketsType()

    res.status(httpStatus.OK).send(result)
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
    const { userId } = req
    try {
        const result = await service.getTickets(userId)
        res.status(httpStatus.OK).send(result)
    } catch (err) {
        return res.sendStatus(httpStatus.NOT_FOUND)
    }
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
    const { ticketTypeId } = req.body
    const { userId } = req
    try {
        const result = await service.postTicket(ticketTypeId, userId)
        res.status(httpStatus.CREATED).send(result)
    } catch (err) {
        if (err.name === 'InvalidDataError') {
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }
        res.sendStatus(httpStatus.NOT_FOUND)
    }
}