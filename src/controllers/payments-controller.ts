import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import * as service from "@/services/payments-service/payments-service"
import { PostPayment } from "@/protocols";

export async function getPayment(req: AuthenticatedRequest, res: Response) {
    let { ticketId } = req.query
    const { userId } = req
    if (!ticketId) return res.sendStatus(httpStatus.BAD_REQUEST)
    const newTicketId = parseInt(ticketId.toString())
    try {
        await service.verifyParameters(newTicketId, userId)
        const result = await service.getPayment(newTicketId)
        res.status(httpStatus.OK).send(result)
    } catch (err) {
        if (err.name === 'UnauthorizedError') {
            return res.sendStatus(httpStatus.UNAUTHORIZED)
        }
        res.sendStatus(httpStatus.NOT_FOUND)
    }

}

export async function postPayment(req: AuthenticatedRequest, res: Response) {
    const { userId } = req
    const body: PostPayment = req.body
    try {
        await service.verifyParameters(body.ticketId, userId)
        const result = await service.postPayment(body)
        res.status(httpStatus.OK).send(result)
    } catch (err) {
        if (err.name === 'UnauthorizedError') {
            return res.sendStatus(httpStatus.UNAUTHORIZED)
        }
        res.sendStatus(httpStatus.NOT_FOUND)
    }
}