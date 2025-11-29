/*
  Warnings:

  - Added the required column `roomWinner` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalRounds` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "roomWinner" TEXT NOT NULL,
ADD COLUMN     "totalRounds" INTEGER NOT NULL;
