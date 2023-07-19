import { prisma } from "@/config";

export async function getBooking(userId: number) {
    return await prisma.booking.findFirst({
        where: { userId },
        select: { id: true, Room: true },
    })
}