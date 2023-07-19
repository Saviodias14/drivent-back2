import { init } from "@/app";
import { cleanDb } from "../helpers";
import * as repository from "@/repositories/booking-repository"
import * as bookingService from "@/services/booking-service"
import faker from "@faker-js/faker";

beforeAll(async () => {
    await init();
    await cleanDb();
});

describe('get booking', () => {
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
                name: faker.datatype.number({min:100, max:999}).toString(),
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