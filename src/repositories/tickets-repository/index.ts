import { prisma } from "@/config"

export async function getTicketsType(ticketId?:number) {
    if(ticketId){
        const result = await prisma.ticketType.findUnique({where:{id: ticketId}})
        return result
    }
    const result = prisma.ticketType.findMany()
    return result
}

export async function getTickets(userId: number) {
    const enrollment = await prisma.enrollment.findUnique({ where: { userId } })
    const result = await prisma.ticket.findFirst({where:{enrollmentId: enrollment.id}})
    return result
}