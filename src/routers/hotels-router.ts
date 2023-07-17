import { authenticateToken } from "@/middlewares";
import { Router } from "express";
import * as controller from '@/controllers/hotels-controller'

const hotelsRouter = Router()

hotelsRouter.get('/', authenticateToken, controller.getHotels)
hotelsRouter.get('/:hotelId', authenticateToken, controller.getHotelsById)

export { hotelsRouter }