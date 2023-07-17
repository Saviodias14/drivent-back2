import { paymentRequired } from "@/errors"
import {verifyEnrollmentAndTicket} from "@/middlewares/"
import * as repository from "@/repositories/hotels-repository"

export async function getHotels(userId:number) {
    await verifyEnrollmentAndTicket(userId)
    const result = repository.getHotels()
    return result
}

export async function getHotelsById(userId: number, hotelId: number) {
    await verifyEnrollmentAndTicket(userId)
    const result = repository.getHotelsById(hotelId)

    if(!result){
        throw paymentRequired()
    }
    return result
}