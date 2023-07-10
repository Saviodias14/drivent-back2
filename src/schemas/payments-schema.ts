import { PostPayment } from "@/protocols";
import Joi from "joi";

const paymentSchema = Joi.object<PostPayment>({
    ticketId: Joi.number().required(),
    cardData: Joi.object({
        issuer: Joi.string().required(),
        number: Joi.number().required(),
        name: Joi.string().required(),
        expirationDate: Joi.string().required(),
        cvv: Joi.number().required()
    }).required()
})

export { paymentSchema }