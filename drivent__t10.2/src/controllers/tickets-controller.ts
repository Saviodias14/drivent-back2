import { Request, Response } from "express";
import httpStatus from "http-status";
import * as service from "@/services/tickets-service"

export async function getTicketsType(req:Request, res: Response) {
    try{
        const result = await service.getTicketsType()

        res.status(httpStatus.OK).send(result)
    } catch(err){
        res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
    }
}