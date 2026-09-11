import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import errorMiddleware from "./middleware/error.js";
// import authMiddleware from "./middleware/auth.js";
import sessionsMiddleware from "./middleware/sessions.js";
import { prisma, connectDB } from "./config/database.js";
import { toNodeHandler } from "better-auth/node";

// import RefreshTokenRepo from "./repositories/refreshTokenRepo.js";
// import RefreshTokenService from "./services/refreshTokenService.js";

import HistoricalRepo from "./repositories/historicalRepo.js";
import HistoricalService from "./services/historicalService.js";
import HistoricalRouter from "./routes/historicalRoute.js";

import DivisionRepo from "./repositories/divisionRepo.js";
import DivisionService from "./services/divisionService.js";
import DivisionRouter from "./routes/divisionRoute.js";

import ExercisesRepo from "./repositories/exercisesRepo.js";
import ExercisesService from "./services/exercisesService.js";
import ExercisesRouter from "./routes/exercisesRoute.js";

import LogbookRepo from "./repositories/logbookRepo.js";
import LogbookService from "./services/logbookService.js";
import LogbookRouter from "./routes/logbookRoute.js";

// import UserRepo from "./repositories/userRepo.js";
// import UserService from "./services/userService.js";
// import UserRouter from "./routes/userRoute.js";

dotenv.config();

// const refreshTokenRepo = new RefreshTokenRepo(prisma);

const historicalRepo = new HistoricalRepo(prisma);
const historicalService = new HistoricalService(historicalRepo);
const historicalRouter = HistoricalRouter(historicalService);

const divisionRepo = new DivisionRepo(prisma);
const divisionService = new DivisionService(divisionRepo);
const divisionRouter = DivisionRouter(divisionService);

const exercisesRepo = new ExercisesRepo(prisma);
const exercisesService = new ExercisesService(exercisesRepo, divisionRepo);
const exercisesRouter = ExercisesRouter(exercisesService);

const logbookRepo = new LogbookRepo(prisma);
const logbookService = new LogbookService(logbookRepo, exercisesRepo, prisma);
const logbookRouter = LogbookRouter(logbookService);

// const userRepo = new UserRepo(prisma);
// const refreshTokenService = new RefreshTokenService(userRepo, refreshTokenRepo);
// const userService = new UserService(userRepo, refreshTokenService);
// const userRouter = UserRouter(userService, refreshTokenService);

const app = express();
const PORT = 8000;

app.use(
  cors(
    {
      origin: "http://localhost:5173",
      credentials: true,
    },
    { origin: "http://localhost:8000", credentials: true },
  ),
);

await connectDB();

const { auth } = await import("./config/auth.js");

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use(cookieParser());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Logbook API",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

// app.use("/api/auth", userRouter);
app.use("/api", sessionsMiddleware, divisionRouter);
app.use("/api", sessionsMiddleware, exercisesRouter);
app.use("/api", sessionsMiddleware, logbookRouter);
app.use("/api", sessionsMiddleware, historicalRouter);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

export default app;
