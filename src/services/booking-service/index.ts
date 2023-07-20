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
    return await repository.postBooking(userId, roomId)
}