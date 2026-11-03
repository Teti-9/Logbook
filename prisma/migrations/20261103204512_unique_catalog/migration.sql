/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Exercises__` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Exercises___name_key" ON "Exercises__"("name");
