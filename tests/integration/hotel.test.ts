import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createEnrollmentWithAddress, createHotel, createManyHotels, createManyHotelsWithRooms, createTicket, createTicketType, createTicketTypeWhitDetails, createUser, generateNotAPositiveNumber } from "../factories";
import * as jwt from 'jsonwebtoken';
import { cleanDb, generateValidToken } from "../helpers";
import { number } from "joi";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app)

describe('GET /hotels', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    describe('When token is valid', () => {
        it('Should respond with 404 if there is no enrollment created', async () => {
            await createHotel()
            const token = await generateValidToken();
            const { statusCode } = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(statusCode).toBe(httpStatus.NOT_FOUND)
        })
        it('Should respond with 404 if there is no ticket created', async () => {
            await createHotel()
            const user = await createUser()
            const token = await generateValidToken(user);
            await createEnrollmentWithAddress(user)
            const { statusCode } = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(statusCode).toBe(httpStatus.NOT_FOUND)
        })
        it('Should respond with 402 if ticket status is RESERVED', async () => {
            await createHotel()
            const user = await createUser()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType()
            await createTicket(enrollment.id, ticketType.id, 'RESERVED')
            const { statusCode } = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(statusCode).toBe(httpStatus.PAYMENT_REQUIRED)
        })
        it('Shoul respond with 402 if ticket is remote', async () => {
            await createHotel()
            const user = await createUser()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeWhitDetails(true, true)
            await createTicket(enrollment.id, ticketType.id, 'PAID')
            const { statusCode } = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(statusCode).toBe(httpStatus.PAYMENT_REQUIRED)
        })
        it('Shoul respond with 402 if there is no hotel', async () => {
            await createHotel()
            const user = await createUser()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeWhitDetails(false, false)
            await createTicket(enrollment.id, ticketType.id, 'PAID')
            const { statusCode } = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(statusCode).toBe(httpStatus.PAYMENT_REQUIRED)
        })
        it('Should respond with status 404 if there are no results', async () => {
            const user = await createUser()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeWhitDetails(true, false)
            await createTicket(enrollment.id, ticketType.id, 'PAID')
            const { statusCode, body } = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(statusCode).toBe(httpStatus.NOT_FOUND)
        })
        it('Should respond with status 200 and with hotels data', async () => {
            await createManyHotels(5)
            const user = await createUser()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeWhitDetails(true, false)
            await createTicket(enrollment.id, ticketType.id, 'PAID')
            const { statusCode, body, } = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(statusCode).toBe(httpStatus.OK)
            expect(body).toHaveLength(5)
            expect(body).toEqual(
                expect.arrayContaining([expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    image: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                })]))
        })
    })
})

describe('GET /hotels /:hotelId', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get(`/hotels/${faker.datatype.number()}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get(`/hotels/${faker.datatype.number()}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get(`/hotels/${faker.datatype.number()}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    describe('When token is valid', () => {
        it('Should respond with 400 if hotelId is not a number', async () => {
            const hotel = await createHotel()
            const user = await createUser()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeWhitDetails(true, false)
            await createTicket(enrollment.id, ticketType.id, 'PAID')
            const { statusCode } = await server.get(`/hotels/${generateNotAPositiveNumber()}`).set('Authorization', `Bearer ${token}`)
            expect(statusCode).toBe(httpStatus.BAD_REQUEST)
        })
        it('Should respond with 404 if there is no enrollment created', async () => {
            const hotel = await createHotel()
            const token = await generateValidToken();
            const { statusCode } = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)
            expect(statusCode).toBe(httpStatus.NOT_FOUND)
        })
        it('Should respond with 404 if there is no ticket created', async () => {
            const hotel = await createHotel()
            const user = await createUser()
            const token = await generateValidToken(user);
            await createEnrollmentWithAddress(user)
            const { statusCode } = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)
            expect(statusCode).toBe(httpStatus.NOT_FOUND)
        })
        it('Should respond with 404 if there is no hotel', async () => {
            const user = await createUser()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeWhitDetails(true, false)
            await createTicket(enrollment.id, ticketType.id, 'PAID')
            const { statusCode, body } = await server.get(`/hotels/${faker.datatype.number()}`).set('Authorization', `Bearer ${token}`)
            expect(statusCode).toBe(httpStatus.NOT_FOUND)
        })
        it('Shoul respond with 402 if ticket status is RESERVED', async () => {
            const hotel = await createHotel()
            const user = await createUser()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType()
            await createTicket(enrollment.id, ticketType.id, 'RESERVED')
            const { statusCode } = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)
            expect(statusCode).toBe(httpStatus.PAYMENT_REQUIRED)
        })
        it('Shoul respond with 402 if ticket is remote', async () => {
            const hotel = await createHotel()
            const user = await createUser()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeWhitDetails(true, true)
            await createTicket(enrollment.id, ticketType.id, 'PAID')
            const { statusCode } = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)
            expect(statusCode).toBe(httpStatus.PAYMENT_REQUIRED)
        })
        it('Shoul respond with 402 if there is no hotel', async () => {
            const hotel = await createHotel()
            const user = await createUser()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeWhitDetails(false, false)
            await createTicket(enrollment.id, ticketType.id, 'PAID')
            const { statusCode } = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)
            expect(statusCode).toBe(httpStatus.PAYMENT_REQUIRED)
        })
        it('Should respond with status 200 and with hotel and rooms data', async () => {
            const hotels = await createManyHotelsWithRooms(1)
            const user = await createUser()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeWhitDetails(true, false)
            await createTicket(enrollment.id, ticketType.id, 'PAID')
            const { statusCode, body } = await server.get(`/hotels/${hotels[0].id}`).set('Authorization', `Bearer ${token}`)
            expect(statusCode).toBe(httpStatus.OK)
            expect(body).toEqual(expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                image: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                Rooms: expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(Number),
                        name: expect.any(String),
                        capacity: expect.any(Number),
                        hotelId: expect.any(Number),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    })
                ])
            }))
        })
    })
})