/*
  Warnings:

  - You are about to drop the column `player1` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `player2` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `winner` on the `Game` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roomId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `isWin` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "player1",
DROP COLUMN "player2",
DROP COLUMN "winner",
ADD COLUMN     "isWin" BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Game_roomId_key" ON "Game"("roomId");
