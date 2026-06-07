/*
  Warnings:

  - You are about to drop the column `confidenceScore` on the `cycle_predictions` table. All the data in the column will be lost.
  - You are about to drop the column `accuracyRating` on the `daily_logs` table. All the data in the column will be lost.
  - You are about to drop the column `feedbackNotes` on the `daily_logs` table. All the data in the column will be lost.
  - Made the column `ovulationDate` on table `cycle_predictions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "cycle_predictions" DROP COLUMN "confidenceScore",
ALTER COLUMN "ovulationDate" SET NOT NULL;

-- AlterTable
ALTER TABLE "daily_logs" DROP COLUMN "accuracyRating",
DROP COLUMN "feedbackNotes";
