/*
  Warnings:

  - You are about to drop the column `backoff_reps` on the `Historical` table. All the data in the column will be lost.
  - You are about to drop the column `backoff_weight` on the `Historical` table. All the data in the column will be lost.
  - You are about to drop the column `topset_reps` on the `Historical` table. All the data in the column will be lost.
  - You are about to drop the column `topset_weight` on the `Historical` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Historical" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exerciseId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "series" INTEGER NOT NULL,
    "previous_topset_weight" REAL NOT NULL,
    "previous_topset_reps" INTEGER NOT NULL,
    "previous_backoff_weight" REAL,
    "previous_backoff_reps" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Historical" ("createdAt", "deletedAt", "exerciseId", "id", "isDeleted", "name", "previous_backoff_reps", "previous_backoff_weight", "previous_topset_reps", "previous_topset_weight", "series", "updatedAt") SELECT "createdAt", "deletedAt", "exerciseId", "id", "isDeleted", "name", "previous_backoff_reps", "previous_backoff_weight", "previous_topset_reps", "previous_topset_weight", "series", "updatedAt" FROM "Historical";
DROP TABLE "Historical";
ALTER TABLE "new_Historical" RENAME TO "Historical";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
