/*
  Warnings:

  - The primary key for the `Author` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Genre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Reservation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_BookAuthors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_BookGenres` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."Reservation" DROP CONSTRAINT "Reservation_bookId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reservation" DROP CONSTRAINT "Reservation_reservedById_fkey";

-- DropForeignKey
ALTER TABLE "public"."_BookAuthors" DROP CONSTRAINT "_BookAuthors_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_BookAuthors" DROP CONSTRAINT "_BookAuthors_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_BookGenres" DROP CONSTRAINT "_BookGenres_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_BookGenres" DROP CONSTRAINT "_BookGenres_B_fkey";

-- AlterTable
ALTER TABLE "Author" DROP CONSTRAINT "Author_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Author_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Author_id_seq";

-- AlterTable
ALTER TABLE "Book" DROP CONSTRAINT "Book_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Book_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Book_id_seq";

-- AlterTable
ALTER TABLE "Genre" DROP CONSTRAINT "Genre_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Genre_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Genre_id_seq";

-- AlterTable
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "bookId" SET DATA TYPE TEXT,
ALTER COLUMN "reservedById" DROP NOT NULL,
ALTER COLUMN "reservedById" SET DATA TYPE TEXT,
ADD CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Reservation_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "_BookAuthors" DROP CONSTRAINT "_BookAuthors_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_BookAuthors_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "_BookGenres" DROP CONSTRAINT "_BookGenres_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_BookGenres_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_reservedById_fkey" FOREIGN KEY ("reservedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookAuthors" ADD CONSTRAINT "_BookAuthors_A_fkey" FOREIGN KEY ("A") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookAuthors" ADD CONSTRAINT "_BookAuthors_B_fkey" FOREIGN KEY ("B") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookGenres" ADD CONSTRAINT "_BookGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookGenres" ADD CONSTRAINT "_BookGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
