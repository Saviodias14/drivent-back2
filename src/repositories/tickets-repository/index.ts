import { prisma } from "@/config"

export async function getTicketsType(userId:number) {
    const enrollment = await prisma.enrollment.findFirst({
        where:{userId},
        select:{id:true}
    })
    const ticket = await prisma.ticket.findFirst({
        where: { enrollmentId: enrollment.id },
        select: { ticketTypeId: true },
      })
    const result = prisma.ticketType.findUnique({
        where:{id:ticket.ticketTypeId}
    })
    return result
}