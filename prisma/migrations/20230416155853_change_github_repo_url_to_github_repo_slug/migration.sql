/*
  Warnings:

  - You are about to drop the column `githubRepoUrl` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "githubRepoUrl",
ADD COLUMN     "githubRepoSlug" TEXT;
