/*
  Warnings:

  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BookGenres` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_BookGenres" DROP CONSTRAINT "_BookGenres_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_BookGenres" DROP CONSTRAINT "_BookGenres_B_fkey";

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "genres" TEXT[];

-- DropTable
DROP TABLE "public"."Genre";

-- DropTable
DROP TABLE "public"."_BookGenres";
