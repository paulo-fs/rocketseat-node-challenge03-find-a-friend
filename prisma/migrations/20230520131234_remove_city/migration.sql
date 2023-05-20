/*
  Warnings:

  - You are about to drop the column `city` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `detais` on the `pets` table. All the data in the column will be lost.
  - Added the required column `details` to the `pets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pets" DROP COLUMN "city",
DROP COLUMN "detais",
ADD COLUMN     "details" TEXT NOT NULL;
