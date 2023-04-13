import { ForbiddenException, Injectable } from '@nestjs/common';
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
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        githubProfile: true,
      },
    });

    const projects = await this.prisma.project.findMany({
      where: {
        githubProfileId: user.githubProfile.id,
      },
    });

    if (projects.length > 0) {
      throw new ForbiddenException(
        'Cannot delete Github Profile. It is associated with a project.',
      );
    }

    return this.prisma.githubProfile.delete({
      where: {
        userId,
      },
    });
  }
}
