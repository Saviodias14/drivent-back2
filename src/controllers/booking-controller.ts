import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import * as service from "@/services/booking-service"

export async function getBooking(req: AuthenticatedRequest, res: Response){
    const { userId } = req
    try {
        const result = await service.getBooking(userId)
        res.status(httpStatus.OK).send(result)
    } catch (err) {
        return res.sendStatus(httpStatus.NOT_FOUND)
    }
}