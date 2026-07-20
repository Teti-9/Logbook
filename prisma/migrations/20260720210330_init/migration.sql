-- CreateEnum
CREATE TYPE "Day" AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- CreateTable
CREATE TABLE "Division" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "day" "Day" NOT NULL,
    "userId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Division_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercises" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "series" INTEGER NOT NULL,
    "topset_weight" DOUBLE PRECISION NOT NULL,
    "topset_reps" INTEGER NOT NULL,
    "backoff_weight" DOUBLE PRECISION,
    "backoff_reps" INTEGER,
    "divisionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logbook" (
    "id" SERIAL NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "topset_weight" DOUBLE PRECISION NOT NULL,
    "topset_reps" INTEGER NOT NULL,
    "backoff_weight" DOUBLE PRECISION,
    "backoff_reps" INTEGER,
    "sinc" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Logbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Historical" (
    "id" SERIAL NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "series" INTEGER NOT NULL,
    "previous_topset_weight" DOUBLE PRECISION NOT NULL,
    "previous_topset_reps" INTEGER NOT NULL,
    "previous_backoff_weight" DOUBLE PRECISION,
    "previous_backoff_reps" INTEGER,
    "userId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Historical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "replacedBy" TEXT,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Division_userId_day_isDeleted_idx" ON "Division"("userId", "day", "isDeleted");

-- CreateIndex
CREATE INDEX "Exercises_userId_divisionId_isDeleted_idx" ON "Exercises"("userId", "divisionId", "isDeleted");

-- CreateIndex
CREATE INDEX "Logbook_userId_exerciseId_isDeleted_idx" ON "Logbook"("userId", "exerciseId", "isDeleted");

-- CreateIndex
CREATE INDEX "Historical_userId_exerciseId_isDeleted_idx" ON "Historical"("userId", "exerciseId", "isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Division" ADD CONSTRAINT "Division_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercises" ADD CONSTRAINT "Exercises_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercises" ADD CONSTRAINT "Exercises_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logbook" ADD CONSTRAINT "Logbook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logbook" ADD CONSTRAINT "Logbook_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historical" ADD CONSTRAINT "Historical_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historical" ADD CONSTRAINT "Historical_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
