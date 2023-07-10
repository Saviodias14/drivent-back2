import { invalidDataError, notFoundError } from "@/errors"
import { NewTicket } from "@/protocols"
import * as repository from "@/repositories/tickets-repository"
import { TicketType } from "@prisma/client"
export async function getTicketsType(): Promise<[] | TicketType[] | TicketType> {
    const result = await repository.getTicketsType()
    if (!result) {
        return []
    }
    return result
}

export async function getTickets(userId: number) {
    const ticket = await repository.getTickets(userId)
    const TicketType = await repository.getUniqueTicketType(ticket.ticketTypeId)
    if (!ticket ) throw notFoundError()
    if (!TicketType ) throw notFoundError()
    const result = { ...ticket, TicketType }
    return result
}

export async function postTicket(ticketTypeId: number, userId: number) {
    const TicketType = await repository.getUniqueTicketType(ticketTypeId)
    const enrollmentId = await repository.getEnrollmentId(userId)
    if(!enrollmentId) throw notFoundError()
    if(!TicketType) throw invalidDataError(`${ticketTypeId} dont exist`)
    const ticket: Omit<NewTicket, 'id' | 'createdAt' | 'updatedAt'> = {
        status: 'RESERVED',
        ticketTypeId,
        enrollmentId,
        TicketType,
    }
    const result = await repository.createTicket(ticket)
    return {...result, ...ticket}
}