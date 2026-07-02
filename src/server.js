import "dotenv/config"
import express from "express"
import cors from "cors"
import errorMiddleware from "./middleware/error.js"
import authMiddleware from "./middleware/auth.js"
import { prisma, connectDB } from "./config/database.js"

import HistoricalRepo from "./repositories/historicalRepo.js"
import HistoricalService from "./services/historicalService.js"
import HistoricalRouter from "./routes/historicalRoute.js"

import DivisionRepo from "./repositories/divisionRepo.js"
import DivisionService from "./services/divisionService.js"
import DivisionRouter from "./routes/divisionRoute.js"

import ExercisesRepo from "./repositories/exercisesRepo.js"
import ExercisesService from "./services/exercisesService.js"
import ExercisesRouter from "./routes/exercisesRoute.js"

import LogbookRepo from "./repositories/logbookRepo.js"
import LogbookService from "./services/logbookService.js"
import LogbookRouter from "./routes/logbookRoute.js"

import UserRepo from "./repositories/userRepo.js"
import UserService from "./services/userService.js"
import UserRouter from "./routes/userRoute.js"

const app = express()
const PORT = 8000

const historicalRepo = new HistoricalRepo(prisma)
const historicalService = new HistoricalService(historicalRepo)
const historicalRouter = HistoricalRouter(historicalService)

const divisionRepo = new DivisionRepo(prisma)
const divisionService = new DivisionService(divisionRepo)
const divisionRouter = DivisionRouter(divisionService)

const exercisesRepo = new ExercisesRepo(prisma)
const exercisesService = new ExercisesService(exercisesRepo, divisionRepo)
const exercisesRouter = ExercisesRouter(exercisesService)

const logbookRepo = new LogbookRepo(prisma)
const logbookService = new LogbookService(logbookRepo, exercisesRepo, prisma)
const logbookRouter = LogbookRouter(logbookService)

const userRepo = new UserRepo(prisma)
const userService = new UserService(userRepo)
const userRouter = UserRouter(userService)

app.use(cors())

app.use(express.json())

app.use("/api", userRouter)
app.use("/api", authMiddleware, divisionRouter)
app.use("/api", authMiddleware, exercisesRouter)
app.use("/api", authMiddleware, logbookRouter)
app.use("/api", authMiddleware, historicalRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})

app.use(errorMiddleware)

connectDB()

export default app