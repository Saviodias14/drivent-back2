import app, { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import { createEnrollmentWithAddress, createHotelWithRooms, createTicket, createTicketTypeWhitDetails, createUser } from "../factories";
import * as jwt from 'jsonwebtoken';
import { createBooking } from "../factories/booking-factory";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app)

describe('GET /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    describe('When token is valid', () => {
        it('Should respond with status 404 if the user has no booking', async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            const { statusCode } = await server.get('/booking').set('Authorization', `Bearer ${token}`)
            expect(statusCode).toBe(httpStatus.NOT_FOUND)
        })
        it('Should respond with status 200 and send the booking if the user has a booking', async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            const hotel = await createHotelWithRooms()
            const booking = await createBooking(user.id, hotel.Rooms[0].id)
            const { statusCode, body } = await server.get('/booking').set('Authorization', `Bearer ${token}`)
            expect(statusCode).toBe(httpStatus.OK)
            expect(body).toEqual(expect.objectContaining({
                ...booking,
                Room: {
                    ...booking.Room,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                }
            }))
        })
    })
})

describe('POST /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('Should respond with status 403 if the ticket is no valid', async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const hotel = await createHotelWithRooms()
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypeWhitDetails(false, true)
        await createTicket(enrollment.id, ticketType.id, 'RESERVED')
        const { statusCode } = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ "roomId": hotel.Rooms[0].id })
        expect(statusCode).toBe(httpStatus.FORBIDDEN)
    })
    it('Should respond with status 404 if the roomId does not exist', async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const hotel = await createHotelWithRooms()
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypeWhitDetails(true, false)
        await createTicket(enrollment.id, ticketType.id, 'PAID')
        const { statusCode } = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ "roomId": faker.datatype.number() })
        expect(statusCode).toBe(httpStatus.NOT_FOUND)
    })
    it('Should respond with status 200 and with the boo', async () => {
        const user = await createUser()
        const token = await generateValidToken(user)
        const hotel = await createHotelWithRooms()
        const enrollment = await createEnrollmentWithAddress(user)
        const ticketType = await createTicketTypeWhitDetails(true, false)
        await createTicket(enrollment.id, ticketType.id, 'PAID')
        const { statusCode, body } = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ "roomId": hotel.Rooms[0].id })
        expect(statusCode).toBe(httpStatus.OK)
        expect(body).toEqual({ "bookingId": expect.any(Number) })
    })
})

describe('PUT /booking/:bookingId', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.put(`/booking/${faker.datatype.number()}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.put(`/booking/${faker.datatype.number()}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.put(`/booking/${faker.datatype.number()}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    describe('When token is valid', () => {
        it('Should respond with status 404 if the roomId do not exist', async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            const hotel = await createHotelWithRooms()
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeWhitDetails(true, false)
            const booking = await createBooking(user.id, hotel.Rooms[0].id)
            await createTicket(enrollment.id, ticketType.id, 'PAID')
            const { statusCode } = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({ "roomId": faker.datatype.number() })
            expect(statusCode).toBe(httpStatus.NOT_FOUND)
        })
        it('Should respond with status 403 if there are no booking or no vacancy', async()=>{
            const user = await createUser()
            const token = await generateValidToken(user)
            const hotel = await createHotelWithRooms()
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeWhitDetails(true, false)
            await createTicket(enrollment.id, ticketType.id, 'PAID')
            const { statusCode } = await server.put(`/booking/${faker.datatype.number()}`).set('Authorization', `Bearer ${token}`).send({ "roomId": hotel.Rooms[0].id })
            expect(statusCode).toBe(httpStatus.FORBIDDEN)
        })
        it('Should respond with status 200 and send bookingId', async()=>{
            const user = await createUser()
            const token = await generateValidToken(user)
            const hotel = await createHotelWithRooms()
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeWhitDetails(true, false)
            const booking = await createBooking(user.id, hotel.Rooms[0].id)
            await createTicket(enrollment.id, ticketType.id, 'PAID')
            const { statusCode, body } = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({ "roomId": hotel.Rooms[1].id })
            expect(statusCode).toBe(httpStatus.OK)
            expect(body).toEqual({ "bookingId": expect.any(Number) })
        })
    })
})