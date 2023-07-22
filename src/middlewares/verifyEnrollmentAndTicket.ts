import { prisma } from "@/config"
import { notFoundError, paymentRequired, ForbiddenError } from "@/errors"

export async function verifyEnrollmentAndTicket(userId: number) {
    const enrollment = await verifyEnrollment(userId)
    if (!enrollment) {
        throw notFoundError()
    }
    const ticket = await verifyTicket(enrollment.id)
    if (!ticket) {
        throw notFoundError()
    }
    if(ticket.status==='RESERVED'||!ticket.TicketType.includesHotel||ticket.TicketType.isRemote){
        throw paymentRequired()
    }
}

export async function verifyTicketAndTicketType(userId:number) {
    const enrollment = await verifyEnrollment(userId)
    if(!enrollment){
        throw ForbiddenError()
    }
    const ticket = await verifyTicket(enrollment.id)
    if(ticket.status==='RESERVED'||ticket.TicketType.isRemote||!ticket.TicketType.includesHotel){
        throw ForbiddenError()
    }

}

export async function verifyEnrollment(userId: number) {
    return await prisma.enrollment.findUnique({
        where: {
            userId
        },
    })
}

export async function verifyTicket(enrollmentId: number) {

    return await prisma.ticket.findFirst({
        where: {
            enrollmentId
        },
        include: {
            TicketType: true
        }
    })
}