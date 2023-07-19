import { notFoundError } from "@/errors"
import * as repository from "@/repositories/booking-repository"

export async function getBooking(userId: number) {
    const result = await repository.getBooking(userId)
    if(!result){
        throw notFoundError()
    }
    return result
}