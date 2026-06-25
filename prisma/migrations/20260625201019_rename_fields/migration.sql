/*
  Warnings:

  - You are about to drop the column `reps` on the `Exercises` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Exercises` table. All the data in the column will be lost.
  - You are about to drop the column `previous_reps` on the `Historical` table. All the data in the column will be lost.
  - You are about to drop the column `previous_weight` on the `Historical` table. All the data in the column will be lost.
  - You are about to drop the column `reps` on the `Historical` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Historical` table. All the data in the column will be lost.
  - You are about to drop the column `reps` on the `Logbook` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Logbook` table. All the data in the column will be lost.
  - Added the required column `topset_reps` to the `Exercises` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topset_weight` to the `Exercises` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previous_topset_reps` to the `Historical` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previous_topset_weight` to the `Historical` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topset_reps` to the `Historical` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topset_weight` to the `Historical` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topset_reps` to the `Logbook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topset_weight` to the `Logbook` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exercises" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "series" INTEGER NOT NULL,
    "topset_weight" REAL NOT NULL,
    "topset_reps" INTEGER NOT NULL,
    "backoff_weight" REAL,
    "backoff_reps" INTEGER,
    "divisionId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Exercises_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Exercises" ("backoff_reps", "backoff_weight", "createdAt", "deletedAt", "divisionId", "id", "isDeleted", "name", "series", "updatedAt") SELECT "backoff_reps", "backoff_weight", "createdAt", "deletedAt", "divisionId", "id", "isDeleted", "name", "series", "updatedAt" FROM "Exercises";
DROP TABLE "Exercises";
ALTER TABLE "new_Exercises" RENAME TO "Exercises";
CREATE TABLE "new_Historical" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exerciseId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "series" INTEGER NOT NULL,
    "topset_weight" REAL NOT NULL,
    "topset_reps" INTEGER NOT NULL,
    "previous_topset_weight" REAL NOT NULL,
    "previous_topset_reps" INTEGER NOT NULL,
    "backoff_weight" REAL,
    "backoff_reps" INTEGER,
    "previous_backoff_weight" REAL,
    "previous_backoff_reps" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Historical" ("createdAt", "deletedAt", "exerciseId", "id", "isDeleted", "name", "series", "updatedAt") SELECT "createdAt", "deletedAt", "exerciseId", "id", "isDeleted", "name", "series", "updatedAt" FROM "Historical";
DROP TABLE "Historical";
ALTER TABLE "new_Historical" RENAME TO "Historical";
CREATE TABLE "new_Logbook" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exerciseId" INTEGER NOT NULL,
    "topset_weight" REAL NOT NULL,
    "topset_reps" INTEGER NOT NULL,
    "backoff_weight" REAL,
    "backoff_reps" INTEGER,
    "sinc" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Logbook_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercises" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Logbook" ("backoff_reps", "backoff_weight", "createdAt", "deletedAt", "exerciseId", "id", "isDeleted", "sinc", "updatedAt") SELECT "backoff_reps", "backoff_weight", "createdAt", "deletedAt", "exerciseId", "id", "isDeleted", "sinc", "updatedAt" FROM "Logbook";
DROP TABLE "Logbook";
ALTER TABLE "new_Logbook" RENAME TO "Logbook";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
