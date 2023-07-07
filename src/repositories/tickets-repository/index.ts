import { prisma } from "@/config"

export async function getTicketsType(userId:number) {
    const ticket = await prisma.ticket.findFirst({
        where: { enrollmentId: userId },
        select: { ticketTypeId: true },
      })
    const result = prisma.ticketType.findUnique({
        where:{id:ticket.ticketTypeId}
    })
    return result
}