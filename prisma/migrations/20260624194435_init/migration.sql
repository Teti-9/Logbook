/*
  Warnings:

  - Added the required column `previous_reps` to the `Historical` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previous_weight` to the `Historical` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Historical" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exerciseId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "series" INTEGER NOT NULL,
    "weight" REAL NOT NULL,
    "previous_weight" REAL NOT NULL,
    "reps" INTEGER NOT NULL,
    "previous_reps" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Historical" ("createdAt", "deletedAt", "exerciseId", "id", "isDeleted", "name", "reps", "series", "updatedAt", "weight") SELECT "createdAt", "deletedAt", "exerciseId", "id", "isDeleted", "name", "reps", "series", "updatedAt", "weight" FROM "Historical";
DROP TABLE "Historical";
ALTER TABLE "new_Historical" RENAME TO "Historical";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
