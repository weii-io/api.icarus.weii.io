import {
  Body,
  Controller,
  Delete,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { CreateGithubProfileDto } from './dto';
import { GithubProfileService } from './github-profile.service';

@Controller()
export class GithubProfileController {
  constructor(private readonly githubProfileService: GithubProfileService) {}

  @Post()
  @UseGuards(JwtGuard)
  createGithubProfile(
    @GetUser('id', ParseIntPipe) userId: number,
    @Body() dto: CreateGithubProfileDto,
  ) {
    return this.githubProfileService.createGithubProfile(userId, dto);
  }

  @Delete()
  @UseGuards(JwtGuard)
  deleteGithubProfile(@GetUser('id') userId: number) {
    return this.githubProfileService.deleteGithubProfile(userId);
  }
}
