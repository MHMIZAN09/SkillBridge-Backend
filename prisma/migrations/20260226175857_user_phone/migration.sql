-- DropIndex
DROP INDEX "availability_tutorId_idx";

-- AlterTable
ALTER TABLE "availability" ALTER COLUMN "startTime" SET DATA TYPE TIME,
ALTER COLUMN "endTime" SET DATA TYPE TIME;

-- CreateIndex
CREATE INDEX "availability_tutorId_day_startTime_endTime_idx" ON "availability"("tutorId", "day", "startTime", "endTime");
