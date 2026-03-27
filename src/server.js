// Geral
import express from "express"
import connectDB from "./config/mongodb.js"
import errorMiddleware from "./middleware/errorMiddleware.js"
import authMiddleware from "./middleware/authMiddleware.js"
import { apiLimiter } from './middleware/rateLimitMiddleware.js'
import swaggerUI from "swagger-ui-express"
import swaggerJsdoc from "swagger-jsdoc"
import cors from "cors"
import helmet from "helmet"

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

// Usuário
import usuarioRouter from "./routes/usuario.js"
import Usuario from "./models/uSchema.js"
import UsuarioRepository from "./repositories/usuarioRepository.js"
import UsuarioService from "./services/usuarioService.js"
import RefreshToken from "./models/refreshTokenSchema.js"
import RefreshTokenRepository from "./repositories/refreshTokenRepository.js"

const app = express()
const v1 = express.Router()

app.use(helmet())
app.use(cors())

app.use(express.json())

app.use('/api/', apiLimiter)

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Logbook API",
      version: "1.0.0"
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
}

const specs = swaggerJsdoc(options)

const divisaoRepository = new DivisaoRepository(Divisao)
const exercicioRepository = new ExercicioRepository(Exercicio)
const logbookRepository = new LogbookRepository(Logbook, LogErros)
const usuarioRepository = new UsuarioRepository(Usuario)
const refreshTokenRepository = new RefreshTokenRepository(RefreshToken)

const divisaoService = new DivisaoService(divisaoRepository)
const exercicioService = new ExercicioService(exercicioRepository, divisaoRepository, logbookRepository)
const logbookService = new LogbookService(logbookRepository, exercicioRepository)
const usuarioService = new UsuarioService(usuarioRepository, refreshTokenRepository)

const divisao = divisaoRouter(divisaoService)
const exercicio = exercicioRouter(exercicioService)
const logbook = logbookRouter(logbookService)
const usuario = usuarioRouter(usuarioService)

v1.use("/", usuario)
v1.use("/", authMiddleware, divisao)
v1.use("/", authMiddleware, exercicio)
v1.use("/", authMiddleware, logbook)

app.use("/docs/v1", swaggerUI.serve, swaggerUI.setup(specs))
app.use("/api/v1", v1)

app.use(errorMiddleware)

if (process.env.NODE_ENV !== 'test') {
  connectDB()
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
  })
}

export default app