import { Module } from '@nestjs/common';
import { GithubProfileService } from './github_profile.service';
import { GithubProfileController } from './github_profile.controller';

@Module({
  controllers: [GithubProfileController],
  providers: [GithubProfileService],
})
export class GithubProfileModule {}
