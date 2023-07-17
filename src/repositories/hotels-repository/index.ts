import { prisma } from "@/config";

export async function getHotels() {
    return await prisma.hotel.findMany()
}

export async function getHotelsById(hotelId: number) {
    return await prisma.hotel.findUnique({
        where: { id: hotelId },
        include: { Rooms: true }
    })
}