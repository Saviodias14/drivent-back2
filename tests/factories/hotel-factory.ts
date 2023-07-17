import { prisma } from "@/config";
import faker from '@faker-js/faker';

export async function createHotel() {
    return prisma.hotel.create({
        data: {
            name: faker.company.companyName(),
            image: faker.image.business(),
        }
    })
}

export async function createManyHotels(number: number) {
    let hotels = []
    for (let i = 0; i < number; i++) {
        const hotel = {
            name: faker.company.companyName(),
            image: faker.image.business(),
        }
        hotels.push(hotel)
    }
    await prisma.hotel.createMany({
        data:hotels,
    })
}

export async function createHotelWithRooms() {
    let rooms = []
    for (let i = 0; i < 10; i++) {
        rooms.push({
            name: faker.datatype.number({ min: 100, max: 9999 }).toString(),
            capacity: faker.datatype.number({ min: 1, max: 10 })
        })
    }
    return prisma.hotel.create({
        data: {
            name: faker.company.companyName(),
            image: faker.image.business(),
            Rooms: {
                createMany: {
                    data: rooms
                }
            }
        },
        include: { Rooms: true }
    })
}

export async function createManyHotelsWithRooms(number: number) {
    let hotels = []
    for (let i = 0; i < number; i++) {
        const hotel = await createHotelWithRooms()
        hotels.push(hotel)
    }
    return hotels
}

export function generateNotAPositiveNumber() {
    let number: number = parseInt(faker.random.numeric())
    if (number > 0) {
        number = (-1) * number
    }
    const notAPositiveNumber = [faker.image, faker.name, faker.datatype.boolean(),
    faker.datatype.float(), faker.date, faker.address, number]
    return notAPositiveNumber[parseInt(faker.random.numeric()) % 6]
}