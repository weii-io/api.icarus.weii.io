/*
  Warnings:

  - Added the required column `githubUrl` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "githubUrl" TEXT NOT NULL;
