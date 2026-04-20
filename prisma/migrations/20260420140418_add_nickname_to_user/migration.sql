/*
  Warnings:

  - Added the required column `nickname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "nickname" TEXT;

-- Update existing users: set nickname to email
UPDATE "User" SET "nickname" = "email" WHERE "nickname" IS NULL;

-- Make column not nullable
ALTER TABLE "User" ALTER COLUMN "nickname" SET NOT NULL;
