import express from "express"
import cors from "cors"
import errorMiddleware from "./middleware/error.js"
import { prisma, connectDB } from "./config/database.js"

import DivisionRepo from "./repositories/divisionRepo.js"
import DivisionService from "./services/divisionService.js"
import DivisionRouter from "./routes/divisionRoute.js"

import ExercisesRepo from "./repositories/exercisesRepo.js"
import ExercisesService from "./services/exercisesService.js"
import ExercisesRouter from "./routes/exercisesRoute.js"

import LogbookRepo from "./repositories/logbookRepo.js"
import LogbookService from "./services/logbookService.js"
import LogbookRouter from "./routes/logbookRoute.js"

const app = express()
const PORT = 8000

const divisionRepo = new DivisionRepo(prisma)
const divisionService = new DivisionService(divisionRepo)
const divisionRouter = DivisionRouter(divisionService)

const exercisesRepo = new ExercisesRepo(prisma)
const exercisesService = new ExercisesService(exercisesRepo, divisionRepo)
const exercisesRouter = ExercisesRouter(exercisesService)

const logbookRepo = new LogbookRepo(prisma)
const logbookService = new LogbookService(logbookRepo, exercisesRepo)
const logbookRouter = LogbookRouter(logbookService)

app.use(cors())

app.use(express.json())

app.use("/api", divisionRouter)
app.use("/api", exercisesRouter)
app.use("/api", logbookRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})

app.use(errorMiddleware)

connectDB()

export default app