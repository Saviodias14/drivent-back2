import { notFoundError, unauthorizedError } from "@/errors"
import { PostPayment } from "@/protocols";
import * as repository from "@/repositories/payments-repository/payments-repository";

export async function verifyParameters(ticketId: number, userId: number) {
    const existTicket = await repository.getTicket(ticketId)
    if (!existTicket.id) throw notFoundError()
    const enrollment = await repository.getEnrollment(userId)
    if (existTicket.enrollmentId!==enrollment.id) throw unauthorizedError()
}

export async function getPayment(ticketId: number) {
    const result = await repository.getPayment(ticketId)
    return result
}

export async function postPayment(body: PostPayment) {
    const cardLastDigits = body.cardData.number.toString().slice(-4)
    const payment = await repository.postPayment(body, cardLastDigits)
    const result = { ...payment, cardLastDigits, cardIssuer: body.cardData.issuer, ticketId: body.ticketId }
    return result
}