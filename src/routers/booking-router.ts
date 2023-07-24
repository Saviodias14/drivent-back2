import { Router } from "express";
import * as controller from "@/controllers/booking-controller"
import { authenticateToken, validateBody } from "@/middlewares";
import { bookingSchema } from "@/schemas";

const bookingRouter = Router()

bookingRouter.get("/", authenticateToken,  controller.getBooking)
bookingRouter.post("/", authenticateToken, validateBody(bookingSchema), controller.postBooking)
bookingRouter.put("/:bookingId", authenticateToken, validateBody(bookingSchema), controller.updateBooking)

export { bookingRouter }