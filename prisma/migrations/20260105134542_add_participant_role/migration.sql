/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `conversation_participants` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('CREATOR', 'ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "conversation_participants" DROP COLUMN "isAdmin",
ADD COLUMN     "role" "ParticipantRole" NOT NULL DEFAULT 'MEMBER';
