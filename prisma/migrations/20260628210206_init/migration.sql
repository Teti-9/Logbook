-- CreateIndex
CREATE INDEX "Division_day_isDeleted_idx" ON "Division"("day", "isDeleted");

-- CreateIndex
CREATE INDEX "Exercises_divisionId_isDeleted_idx" ON "Exercises"("divisionId", "isDeleted");

-- CreateIndex
CREATE INDEX "Historical_exerciseId_isDeleted_idx" ON "Historical"("exerciseId", "isDeleted");

-- CreateIndex
CREATE INDEX "Logbook_exerciseId_isDeleted_idx" ON "Logbook"("exerciseId", "isDeleted");
