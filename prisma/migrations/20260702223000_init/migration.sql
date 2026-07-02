/*
  Warnings:

  - Added the required column `userId` to the `Division` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Exercises` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Historical` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Logbook` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Division" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Division_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Division" ("createdAt", "day", "deletedAt", "id", "isDeleted", "name", "updatedAt") SELECT "createdAt", "day", "deletedAt", "id", "isDeleted", "name", "updatedAt" FROM "Division";
DROP TABLE "Division";
ALTER TABLE "new_Division" RENAME TO "Division";
CREATE INDEX "Division_userId_day_isDeleted_idx" ON "Division"("userId", "day", "isDeleted");
CREATE TABLE "new_Exercises" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "series" INTEGER NOT NULL,
    "topset_weight" REAL NOT NULL,
    "topset_reps" INTEGER NOT NULL,
    "backoff_weight" REAL,
    "backoff_reps" INTEGER,
    "divisionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Exercises_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Exercises_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Exercises" ("backoff_reps", "backoff_weight", "createdAt", "deletedAt", "divisionId", "id", "isDeleted", "name", "series", "topset_reps", "topset_weight", "updatedAt") SELECT "backoff_reps", "backoff_weight", "createdAt", "deletedAt", "divisionId", "id", "isDeleted", "name", "series", "topset_reps", "topset_weight", "updatedAt" FROM "Exercises";
DROP TABLE "Exercises";
ALTER TABLE "new_Exercises" RENAME TO "Exercises";
CREATE INDEX "Exercises_userId_divisionId_isDeleted_idx" ON "Exercises"("userId", "divisionId", "isDeleted");
CREATE TABLE "new_Historical" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exerciseId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "series" INTEGER NOT NULL,
    "previous_topset_weight" REAL NOT NULL,
    "previous_topset_reps" INTEGER NOT NULL,
    "previous_backoff_weight" REAL,
    "previous_backoff_reps" INTEGER,
    "userId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Historical_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Historical" ("createdAt", "deletedAt", "exerciseId", "id", "isDeleted", "name", "previous_backoff_reps", "previous_backoff_weight", "previous_topset_reps", "previous_topset_weight", "series", "updatedAt") SELECT "createdAt", "deletedAt", "exerciseId", "id", "isDeleted", "name", "previous_backoff_reps", "previous_backoff_weight", "previous_topset_reps", "previous_topset_weight", "series", "updatedAt" FROM "Historical";
DROP TABLE "Historical";
ALTER TABLE "new_Historical" RENAME TO "Historical";
CREATE INDEX "Historical_userId_exerciseId_isDeleted_idx" ON "Historical"("userId", "exerciseId", "isDeleted");
CREATE TABLE "new_Logbook" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exerciseId" INTEGER NOT NULL,
    "topset_weight" REAL NOT NULL,
    "topset_reps" INTEGER NOT NULL,
    "backoff_weight" REAL,
    "backoff_reps" INTEGER,
    "sinc" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Logbook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Logbook_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercises" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Logbook" ("backoff_reps", "backoff_weight", "createdAt", "deletedAt", "exerciseId", "id", "isDeleted", "sinc", "topset_reps", "topset_weight", "updatedAt") SELECT "backoff_reps", "backoff_weight", "createdAt", "deletedAt", "exerciseId", "id", "isDeleted", "sinc", "topset_reps", "topset_weight", "updatedAt" FROM "Logbook";
DROP TABLE "Logbook";
ALTER TABLE "new_Logbook" RENAME TO "Logbook";
CREATE INDEX "Logbook_userId_exerciseId_isDeleted_idx" ON "Logbook"("userId", "exerciseId", "isDeleted");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
