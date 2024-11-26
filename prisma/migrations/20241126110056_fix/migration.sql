-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('F', 'M', 'O');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "gender" "Gender";
