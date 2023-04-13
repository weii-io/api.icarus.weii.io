/*
  Warnings:

  - Added the required column `organizationUrl` to the `GithubProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GithubProfile" ADD COLUMN     "organizationUrl" TEXT NOT NULL;
