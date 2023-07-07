import { prisma } from "@/config"

export async function getTicketsType() {
    const result = prisma.ticketType.findMany()
    return result
}