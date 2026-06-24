/*
  Warnings:

  - You are about to drop the `LogBook` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LogBook";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Logbook" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exerciseId" INTEGER NOT NULL,
    "weight" REAL NOT NULL,
    "reps" INTEGER NOT NULL,
    "sinc" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Logbook_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercises" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
