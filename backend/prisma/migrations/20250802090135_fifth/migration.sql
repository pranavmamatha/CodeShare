/*
  Warnings:

  - The primary key for the `Room` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `data` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `Room` table. All the data in the column will be lost.
  - Added the required column `code` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Room" DROP CONSTRAINT "Room_pkey",
DROP COLUMN "data",
DROP COLUMN "roomId",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Room_pkey" PRIMARY KEY ("id");
