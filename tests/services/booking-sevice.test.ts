import { init } from "@/app";
import { cleanDb } from "../helpers";
import * as repository from "@/repositories/booking-repository"
import * as bookingService from "@/services/booking-service"
import * as middleware from "@/middlewares/verifyEnrollmentAndTicket"
import faker from "@faker-js/faker";
import { Room } from "@prisma/client";

beforeAll(async () => {
    await init();
    await cleanDb();
});

describe('get /booking', () => {
    it('Should throw Not Found Error if there is no booking', () => {
        jest.spyOn(repository, "getBooking").mockImplementationOnce(() => {
            return undefined
        })
        const userId = faker.datatype.number()
        const promisse = bookingService.getBooking(userId)
        expect(promisse).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        })
    })
    it('Should return the bookingId and the Room object', async () => {
        const result = {
            id: faker.datatype.number(),
            Room: {
                id: faker.datatype.number(),
                name: faker.datatype.number({ min: 100, max: 999 }).toString(),
                capacity: faker.datatype.number(),
                hotelId: faker.datatype.number(),
                createdAt: (new Date()).toString(),
                updatedAt: (new Date()).toString()
            }
        }
        jest.spyOn(repository, "getBooking").mockImplementationOnce((): any => {
            return result
        })
        const userId = faker.datatype.number()
        const promisse = await bookingService.getBooking(userId)
        expect(promisse).toEqual(result)
    })
})

describe('POST /booking', () => {
    it('Should throw Not Found Error if there are no room', async () => {
        jest.spyOn(middleware, "verifyTicketAndTicketType").mockResolvedValueOnce(undefined)
        jest.spyOn(repository, "verifyRoomId").mockResolvedValueOnce(undefined)

        const promisse = bookingService.postBooking(faker.datatype.number(), faker.datatype.number())
        expect(promisse).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        })
    })
    const room: Room = {
        id: faker.datatype.number(),
        name: faker.name.findName(),
        capacity: faker.datatype.number(),
        hotelId: faker.datatype.number(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
    }
    it('Should throw Forbidden Error if there are no room', async () => {

        jest.spyOn(middleware, "verifyTicketAndTicketType").mockResolvedValueOnce(undefined)
        jest.spyOn(repository, "verifyRoomId").mockResolvedValueOnce(room)
        jest.spyOn(repository, "roomVacancy").mockImplementationOnce(() => Promise.resolve(room.capacity))

        const promisse = bookingService.postBooking(faker.datatype.number(), faker.datatype.number())
        expect(promisse).rejects.toEqual({
            name: 'ForbiddenError',
            message: 'This action is not pemited',
        })
    })
    it('Should pass returning bookingId', async () => {
        const bookingId = { roomId: faker.datatype.number() }
        jest.spyOn(middleware, "verifyTicketAndTicketType").mockResolvedValueOnce(undefined)
        jest.spyOn(repository, "verifyRoomId").mockResolvedValueOnce(room)
        jest.spyOn(repository, "roomVacancy").mockImplementationOnce(() => Promise.resolve(room.capacity - 1))
        jest.spyOn(repository, "postBooking").mockImplementationOnce(() => Promise.resolve(bookingId))

        const promisse = await bookingService.postBooking(faker.datatype.number(), faker.datatype.number())
        expect(promisse).toEqual(bookingId)
    })
})