/*
  Warnings:

  - You are about to drop the column `githubUrl` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "githubUrl",
ADD COLUMN     "githubRepoUrl" TEXT;
