import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGithubProfileDto } from './dto';

@Injectable()
export class GithubProfileService {
  constructor(private prisma: PrismaService) {}

  async createGithubProfile(userId: number, dto: CreateGithubProfileDto) {
    return this.prisma.githubProfile.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async deleteGithubProfile(userId: number) {
    return this.prisma.githubProfile.delete({
      where: {
        userId,
      },
    });
  }
}
