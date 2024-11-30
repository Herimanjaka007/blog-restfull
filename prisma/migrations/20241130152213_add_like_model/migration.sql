/*
  Warnings:

  - You are about to drop the column `reactionNumber` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "reactionNumber";

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "blogId" INTEGER NOT NULL,
    "likerId" INTEGER NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_likerId_fkey" FOREIGN KEY ("likerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
