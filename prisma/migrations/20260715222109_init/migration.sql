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
    "userId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Historical_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Historical_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercises" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Historical" ("createdAt", "deletedAt", "exerciseId", "id", "isDeleted", "name", "previous_backoff_reps", "previous_backoff_weight", "previous_topset_reps", "previous_topset_weight", "series", "updatedAt", "userId") SELECT "createdAt", "deletedAt", "exerciseId", "id", "isDeleted", "name", "previous_backoff_reps", "previous_backoff_weight", "previous_topset_reps", "previous_topset_weight", "series", "updatedAt", "userId" FROM "Historical";
DROP TABLE "Historical";
ALTER TABLE "new_Historical" RENAME TO "Historical";
CREATE INDEX "Historical_userId_exerciseId_isDeleted_idx" ON "Historical"("userId", "exerciseId", "isDeleted");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
