/*
  Warnings:

  - You are about to drop the column `date` on the `availability` table. All the data in the column will be lost.
  - Added the required column `day` to the `availability` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- AlterTable
ALTER TABLE "availability" DROP COLUMN "date",
ADD COLUMN     "day" "DayOfWeek" NOT NULL;
