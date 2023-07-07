import { Request, Response } from "express";
import httpStatus from "http-status";
import * as service from "@/services/tickets-service"
import { AuthenticatedRequest } from "@/middlewares";

export async function getTicketsType(req: Request, res: Response) {
    try {
        const result = await service.getTicketsType()

        res.status(httpStatus.OK).send(result)
    } catch (err) {
        res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
    }
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
    const { userId } = req
    try {
        const result = await service.getTickets(userId)
        res.status(httpStatus.OK).send(result)
    } catch (err) {
        if (err.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND)
        }
        res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
    }
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
    const { ticketTypeId } = req.body
    const { userId } = req
    try {
        const result = await service.postTicket(ticketTypeId, userId)
        res.status(httpStatus.CREATED).send(result)
    } catch (err) {
        if (err.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND)
        }
        if(err.name === 'InvalidDataError'){
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }
        res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
    }
}