/*
  Warnings:

  - You are about to drop the column `backoff_reps` on the `Exercises` table. All the data in the column will be lost.
  - You are about to drop the column `backoff_weight` on the `Exercises` table. All the data in the column will be lost.
  - You are about to drop the column `series` on the `Exercises` table. All the data in the column will be lost.
  - You are about to drop the column `topset_reps` on the `Exercises` table. All the data in the column will be lost.
  - You are about to drop the column `topset_weight` on the `Exercises` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Historical` table. All the data in the column will be lost.
  - You are about to drop the column `previous_backoff_reps` on the `Historical` table. All the data in the column will be lost.
  - You are about to drop the column `previous_backoff_weight` on the `Historical` table. All the data in the column will be lost.
  - You are about to drop the column `series` on the `Historical` table. All the data in the column will be lost.
  - You are about to drop the column `backoff_reps` on the `Logbook` table. All the data in the column will be lost.
  - You are about to drop the column `backoff_weight` on the `Logbook` table. All the data in the column will be lost.
  - You are about to drop the column `sinc` on the `Logbook` table. All the data in the column will be lost.
  - Added the required column `rest` to the `Exercises` table without a default value. This is not possible if the table is not empty.
  - Added the required column `series_reps` to the `Exercises` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_muscle_group` to the `Exercises` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AdvancedTechnique" AS ENUM ('backoff');

-- AlterTable
ALTER TABLE "Exercises" DROP COLUMN "backoff_reps",
DROP COLUMN "backoff_weight",
DROP COLUMN "series",
DROP COLUMN "topset_reps",
DROP COLUMN "topset_weight",
ADD COLUMN     "advanced_technique" "AdvancedTechnique",
ADD COLUMN     "observation" TEXT,
ADD COLUMN     "rest" INTEGER NOT NULL,
ADD COLUMN     "series_reps" TEXT NOT NULL,
ADD COLUMN     "target_muscle_group" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Historical" DROP COLUMN "name",
DROP COLUMN "previous_backoff_reps",
DROP COLUMN "previous_backoff_weight",
DROP COLUMN "series",
ADD COLUMN     "extra" TEXT;

-- AlterTable
ALTER TABLE "Logbook" DROP COLUMN "backoff_reps",
DROP COLUMN "backoff_weight",
DROP COLUMN "sinc",
ADD COLUMN     "extra" TEXT,
ADD COLUMN     "sync" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "observation" TEXT;

-- CreateTable
CREATE TABLE "Exercises__" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "target_muscle_group" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercises___pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Exercises___name_idx" ON "Exercises__"("name");
