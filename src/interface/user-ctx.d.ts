import { GithubProfile } from '@prisma/client';

export interface IUserCtx {
  id: number;
  username: string;
  email: string;
  hash: string;
  firstName: string;
  lastName: string;
  githubProfile: GithubProfile?;
}
