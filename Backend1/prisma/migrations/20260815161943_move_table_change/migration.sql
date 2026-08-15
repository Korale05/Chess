/*
  Warnings:

  - You are about to drop the column `playerId` on the `Move` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gameId,moveNumber]` on the table `Move` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `after` to the `Move` table without a default value. This is not possible if the table is not empty.
  - Added the required column `before` to the `Move` table without a default value. This is not possible if the table is not empty.
  - Added the required column `san` to the `Move` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeTaken` to the `Move` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Move" DROP CONSTRAINT "Move_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Move" DROP CONSTRAINT "Move_playerId_fkey";

-- AlterTable
ALTER TABLE "Move" DROP COLUMN "playerId",
ADD COLUMN     "after" TEXT NOT NULL,
ADD COLUMN     "before" TEXT NOT NULL,
ADD COLUMN     "san" TEXT NOT NULL,
ADD COLUMN     "timeTaken" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Move_gameId_idx" ON "Move"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Move_gameId_moveNumber_key" ON "Move"("gameId", "moveNumber");

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
