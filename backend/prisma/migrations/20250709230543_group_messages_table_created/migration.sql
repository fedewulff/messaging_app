/*
  Warnings:

  - You are about to drop the `UserMessages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "UserMessages";

-- CreateTable
CREATE TABLE "UserFriendMessages" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFriendMessages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGroupMessages" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "senderUsername" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserGroupMessages_pkey" PRIMARY KEY ("id")
);
