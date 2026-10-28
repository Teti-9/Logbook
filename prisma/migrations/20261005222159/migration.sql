-- AlterTable
ALTER TABLE "Exercises" ADD COLUMN     "workoutId" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Historical" ADD COLUMN     "workoutId" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Logbook" ADD COLUMN     "workoutId" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Exercises" ADD CONSTRAINT "Exercises_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logbook" ADD CONSTRAINT "Logbook_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historical" ADD CONSTRAINT "Historical_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
