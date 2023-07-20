import { prisma } from "@/config"
import { notFoundError, paymentRequired } from "@/errors"
import { forbidden } from "joi"

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
    const ticket = await verifyTicket(enrollment.id)
    if(ticket.status==='RESERVED'||ticket.TicketType.isRemote||!ticket.TicketType.includesHotel){
        throw forbidden()
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