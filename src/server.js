// Geral
import express from "express"
import connectDB from "./config/mongodb.js"
import swaggerUI from "swagger-ui-express"
import swaggerJsdoc from "swagger-jsdoc"
import cors from "cors"

// Divisão
import divisaoRouter from "./routes/divisao.js"
import Divisao from './models/dSchema.js'
import DivisaoRepository from './repositories/divisaoRepository.js'
import DivisaoService from './services/divisaoService.js'

// Exercícios
import exercicioRouter from "./routes/exercicio.js"
import Exercicio from "./models/eSchema.js"
import ExercicioRepository from "./repositories/exercicioRepository.js"
import ExercicioService from "./services/exercicioService.js"

// Logbooks
import logbookRouter from "./routes/logbook.js"
import Logbook from "./models/lSchema.js"
import LogErros from "./models/logErrosSchema.js"
import LogbookRepository from "./repositories/logbookRepository.js"
import LogbookService from "./services/logbookService.js"


const app = express()

app.use(cors())

app.use(express.json())

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Logbook Docs",
    },
  },
  apis: ["./src/routes/*.js"],
}

const specs = swaggerJsdoc(options)

const divisaoRepository = new DivisaoRepository(Divisao)
const exercicioRepository = new ExercicioRepository(Exercicio)
const logbookRepository = new LogbookRepository(Logbook, LogErros)

const divisaoService = new DivisaoService(divisaoRepository)
const exercicioService = new ExercicioService(exercicioRepository, divisaoRepository)
const logbookService = new LogbookService(logbookRepository, exercicioRepository)

const divisao = divisaoRouter(divisaoService)
const exercicio = exercicioRouter(exercicioService)
const logbook = logbookRouter(logbookService)

app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs))
app.use("/api", divisao)
app.use("/api", exercicio)
app.use("/api", logbook)

if (process.env.NODE_ENV !== 'test') {
  connectDB()
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
  })
}

export default app