import { notFoundError } from "@/errors"
import { ForbiddenError } from "@/errors/forbidden-error"
import { verifyTicketAndTicketType } from "@/middlewares"
import * as repository from "@/repositories/booking-repository"

export async function getBooking(userId: number) {
    const result = await repository.getBooking(userId)
    if (!result) {
        throw notFoundError()
    }
    return result
}

export async function postBooking(userId: number, roomId: number) {
    await verifyTicketAndTicketType(userId)
    const existRoom = await repository.verifyRoomId(roomId)
    if (!existRoom) {
        throw notFoundError()
    }
    const countVacancy = await repository.roomVacancy(roomId)
    if (countVacancy >= existRoom.capacity) {
        throw ForbiddenError()
    }
    const result = await repository.postBooking(userId, roomId)
    return { "bookingId": result }
}

export async function updateBooking(userId: number, roomId: number) {
    const existBooking = await repository.findBooking(userId)
    if(!existBooking){
        throw ForbiddenError()
    }
    const existRoom = await repository.verifyRoomId(roomId)
    if (!existRoom) {
        throw notFoundError()
    }
    const countVacancy = await repository.roomVacancy(roomId)
    if (countVacancy >= existRoom.capacity) {
        throw ForbiddenError()
    }
    await repository.updateBooking(existBooking.id, roomId)
    return {"bookingId":existBooking.id}
}