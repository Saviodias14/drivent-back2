import { notFoundError } from "@/errors"
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
    const TicketType = await repository.getTicketsType(ticket.ticketTypeId)
    if(!ticket||!TicketType){
        throw notFoundError()
    }
    const result = {...ticket, TicketType}
    return result
}