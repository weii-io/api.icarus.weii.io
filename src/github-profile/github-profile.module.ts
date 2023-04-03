import { Module } from '@nestjs/common';
import { GithubProfileService } from './github-profile.service';
import { GithubProfileController } from './github-profile.controller';

@Module({
  controllers: [GithubProfileController],
  providers: [GithubProfileService],
})
export class GithubProfileModule {}
