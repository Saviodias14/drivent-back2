import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import * as service from "@/services/booking-service"

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req
    try {
        const result = await service.getBooking(userId)
        res.status(httpStatus.OK).send(result)
    } catch (err) {
        return res.sendStatus(httpStatus.NOT_FOUND)
    }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req
    const roomId: number = req.body.roomId
    try {
        const result = await service.postBooking(userId, roomId)
        res.send(result)
    } catch (err) {
        if (err.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND)
        }
        if (err.name === 'ForbiddenError') {
            return res.sendStatus(httpStatus.FORBIDDEN)
        }
    }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req
    const roomId: number = req.body.roomId
    const bookingId = parseInt(req.params.bookingId)
    try {
        const result = await service.updateBooking(userId, roomId, bookingId)
        res.send(result)
    } catch (err) {
        if (err.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND)
        }
        if (err.name === 'ForbiddenError') {
            return res.sendStatus(httpStatus.FORBIDDEN)
        }
    }
}