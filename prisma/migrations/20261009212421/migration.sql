/*
  Warnings:

  - Added the required column `divisionId` to the `Historical` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logbookId` to the `Historical` table without a default value. This is not possible if the table is not empty.
  - Added the required column `divisionId` to the `Logbook` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- AlterTable
ALTER TABLE "Exercises" ALTER COLUMN "workoutId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Historical" ADD COLUMN     "divisionId" INTEGER NOT NULL,
ADD COLUMN     "logbookId" INTEGER NOT NULL,
ALTER COLUMN "workoutId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Logbook" ADD COLUMN     "divisionId" INTEGER NOT NULL,
ALTER COLUMN "workoutId" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Division_workoutId_idx" ON "Division"("workoutId");

-- CreateIndex
CREATE INDEX "Exercises_workoutId_idx" ON "Exercises"("workoutId");

-- CreateIndex
CREATE INDEX "Historical_logbookId_idx" ON "Historical"("logbookId");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_tokenHash_idx" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "Workout_userId_isDeleted_idx" ON "Workout"("userId", "isDeleted");

-- AddForeignKey
ALTER TABLE "Logbook" ADD CONSTRAINT "Logbook_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historical" ADD CONSTRAINT "Historical_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historical" ADD CONSTRAINT "Historical_logbookId_fkey" FOREIGN KEY ("logbookId") REFERENCES "Logbook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
