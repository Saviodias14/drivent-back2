import { notFoundError, paymentRequired } from "@/errors"
import {verifyEnrollmentAndTicket} from "@/middlewares/"
import * as repository from "@/repositories/hotels-repository"

export async function getHotels(userId:number) {
    await verifyEnrollmentAndTicket(userId)
    const result = await repository.getHotels()
    if(!result||result.length===0){
        throw notFoundError()
    }
    return result
}

export async function getHotelsById(userId: number, hotelId: number) {
    await verifyEnrollmentAndTicket(userId)
    const result = await repository.getHotelsById(hotelId)

    if(!result){
        throw notFoundError()
    }
    return result
}