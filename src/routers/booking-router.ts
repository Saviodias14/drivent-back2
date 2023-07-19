import { Router } from "express";
import * as controller from "@/controllers/booking-controller"
import { authenticateToken } from "@/middlewares";

const bookingRouter = Router()

bookingRouter.get("/", authenticateToken,  controller.getBooking)
bookingRouter.post("/")
bookingRouter.put("/:bookingId")

export { bookingRouter }