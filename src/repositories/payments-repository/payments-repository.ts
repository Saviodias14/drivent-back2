import { prisma } from "@/config";
import { PostPayment } from "@/protocols";

export async function getTicket(ticketId: number) {
    const result = await prisma.ticket.findUnique({ where: { id: ticketId } })
    return result
}

export async function getEnrollment(userId: number) {

    const result = await prisma.enrollment.findUnique({
        where: {
            userId
        },
        select: {
            id: true
        }
    })
    return result
}

export async function getPayment(ticketId: number) {
    const result = await prisma.payment.findFirst({
        where: {
            ticketId
        }
    })
    return result
}


export async function postPayment(body: PostPayment, cardLastDigits: string) {
    const { TicketType } = await prisma.ticket.update({
        where: {
            id: body.ticketId
        },
        data: {
            status: 'PAID'
        },
        select: {
            TicketType: true
        }
    })
    const result = await prisma.payment.create({
        data: {
            ticketId: body.ticketId,
            value: TicketType.price,
            cardIssuer: body.cardData.issuer,
            cardLastDigits,
        },
        select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            value: true
        }
    })
    return result
}