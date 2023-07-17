import { prisma } from "@/config"
import { notFoundError, paymentRequired } from "@/errors"

export async function verifyEnrollmentAndTicket(userId: number) {
    const enrollment = await verifyEnrollment(userId)
    if (!enrollment) {
        throw notFoundError()
    }
    const ticket = await verifyTicket(enrollment.id)
    if (!ticket) {
        throw notFoundError()
    }
    if(ticket.status==='RESERVED'||!ticket.TicketType.includesHotel){
        throw paymentRequired()
    }
}

async function verifyEnrollment(userId: number) {
    return await prisma.enrollment.findUnique({
        where: {
            userId
        },
    })
}

async function verifyTicket(enrollmentId: number) {
    return await prisma.ticket.findFirst({
        where: {
            enrollmentId
        },
        include: {
            TicketType: true
        }
    })
}