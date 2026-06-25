-- AlterTable
ALTER TABLE "Exercises" ADD COLUMN "backoff_reps" INTEGER;
ALTER TABLE "Exercises" ADD COLUMN "backoff_weight" REAL;

-- AlterTable
ALTER TABLE "Logbook" ADD COLUMN "backoff_reps" INTEGER;
ALTER TABLE "Logbook" ADD COLUMN "backoff_weight" REAL;
