import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import * as service from "@/services/hotels-service"

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const { userId } = req
    try {
        const result = await service.getHotels(userId)
        res.status(httpStatus.OK).send(result)
    } catch (err) {
        if (err.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND)
        }
        if (err.name === 'PaymentRequired') {
            return res.sendStatus(httpStatus.PAYMENT_REQUIRED)
        }
        res.sendStatus(httpStatus.BAD_REQUEST)
    }
}

export async function getHotelsById(req: AuthenticatedRequest, res: Response) {
    const { userId } = req
    const hotelId = parseInt(req.params.hotelId)
    if (!hotelId || hotelId < 1) {
        res.sendStatus(httpStatus.BAD_REQUEST)
    }
    try {
        const result = await service.getHotelsById(userId, hotelId)
        res.status(httpStatus.OK).send(result)
    } catch (err) {
        if (err.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND)
        }
        if (err.name === 'PaymentRequired') {
            return res.sendStatus(httpStatus.PAYMENT_REQUIRED)
        }
        res.sendStatus(httpStatus.BAD_REQUEST)
    }
}