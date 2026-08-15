import { Router } from "express"

import { UsersController } from "@/controllers/users-controller"
import { createAccountLimiter } from "@/middlewares/rate-limiter"

const usersRoutes = Router()
const usersController = new UsersController()

usersRoutes.post("/", createAccountLimiter, usersController.create)

export { usersRoutes }
