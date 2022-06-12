/*
  Warnings:

  - A unique constraint covering the columns `[id,projectId]` on the table `Environment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Environment_id_projectId_key" ON "Environment"("id", "projectId");
