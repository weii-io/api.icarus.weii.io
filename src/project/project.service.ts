import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';

//TODO: add service
@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  // create a project
  createProject(userId: number, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        ...dto,
        ownerId: userId,
      },
    });
  }

  // view project using id
  getProjectById(userId: number, projectId: number) {
    return this.prisma.project.findFirst({
      where: {
        ownerId: userId,
        id: projectId,
      },
      include: {
        tasks: true,
        owner: true,
      },
    });
  }

  // view all projects
  getAllProjects(userId: number) {
    return this.prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        tasks: true,
        owner: true,
      },
    });
  }

  // update a project using id
  async updateProjectById(
    userId: number,
    projectId: number,
    dto: UpdateProjectDto,
  ) {
    const _project = await this.prisma.project.findFirst({
      where: {
        ownerId: userId,
        id: projectId,
      },
    });

    if (!_project || _project.ownerId !== userId)
      throw new ForbiddenException('Access to resources denied');

    return this.prisma.project.update({
      where: {
        id: _project.id,
      },
      data: {
        ...dto,
      },
    });
  }

  // delete a project using id
  async deleteProjectById(userId: number, projectId: number) {
    const _project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });

    // check if user owns the bookmark
    if (!_project || _project.ownerId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.project.delete({
      where: {
        id: _project.id,
      },
    });
  }
}
