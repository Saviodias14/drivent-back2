import Joi from "joi";

const bookingSchema = Joi.object({
    roomId: Joi.number().required()
})

export { bookingSchema }