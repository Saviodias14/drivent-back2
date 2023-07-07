import { prisma } from "@/config"
import { NewTicket } from "@/protocols"

export async function getTicketsType(ticketId?: number) {
    if (ticketId) {
        const result = await prisma.ticketType.findUnique({ where: { id: ticketId } })
        return result
    }
    const result = prisma.ticketType.findMany()
    return result
}

export async function getTickets(userId: number) {
    const enrollment = await prisma.enrollment.findUnique({ where: { userId } })
    const result = await prisma.ticket.findFirst({ where: { enrollmentId: enrollment.id } })
    return result
}

export async function getEnrollmentId(userId: number) {
    const result = await prisma.enrollment.findUnique({ 
        where: { userId },
        select: {id: true} 
    })
    return result.id
}

export async function createTicket(ticket:Omit<NewTicket, 'id' | 'createdAt' | 'updatedAt'>) {
    const result = await prisma.ticket.create({
        data: {
        status: ticket.status,
        ticketTypeId: ticket.ticketTypeId,
        enrollmentId: ticket.enrollmentId,},
        select:{id: true, updatedAt: true, createdAt: true}
    })
    return result
}