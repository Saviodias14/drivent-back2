import { prisma } from "@/config";

export async function getBooking(userId: number) {
    return await prisma.booking.findFirst({
        where: { userId },
        select: { id: true, Room: true },
    })
}
export async function verifyRoomId(roomId: number) {
    return await prisma.room.findUnique({
        where: { id: roomId }
    })
}

export async function roomVacancy(roomId: number) {
    return await prisma.booking.count({
        where: { roomId }
    })
}
export async function postBooking(userId: number, roomId: number) {
    const bookingId = await prisma.booking.create({
        data: {
            roomId,
            userId
        },
        select:{id:true}
    })
    return bookingId
}