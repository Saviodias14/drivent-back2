import { PostPayment } from "@/protocols";
import Joi from "joi";

const paymentSchema = Joi.object<PostPayment>({
    ticketId: Joi.required(),
    cardData: Joi.object({
        issuer: Joi.required(),
        number: Joi.required(),
        name: Joi.required(),
        expirationDate: Joi.required(),
        cvv: Joi.required()
    }).required()
})

export { paymentSchema }