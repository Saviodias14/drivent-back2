import Joi from 'joi';

type TicketTipeId = {
    ticketTypeId: number
}
export const createTicketSchema = Joi.object<TicketTipeId>({ 
    ticketTypeId: Joi.number().integer().min(1).required()
});
