/*
  Warnings:

  - You are about to drop the column `roomWinner` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `totalRounds` on the `Game` table. All the data in the column will be lost.
  - Added the required column `winner` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Game_roomId_key";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "roomWinner",
DROP COLUMN "totalRounds",
ADD COLUMN     "winner" TEXT NOT NULL;
