/*
  Warnings:

  - Made the column `reservedById` on table `Reservation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Reservation" DROP CONSTRAINT "Reservation_reservedById_fkey";

-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "reservedById" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_reservedById_fkey" FOREIGN KEY ("reservedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
