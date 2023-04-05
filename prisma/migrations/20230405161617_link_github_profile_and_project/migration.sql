-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "githubProfileId" INTEGER;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_githubProfileId_fkey" FOREIGN KEY ("githubProfileId") REFERENCES "GithubProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
