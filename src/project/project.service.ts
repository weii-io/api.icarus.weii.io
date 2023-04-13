import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectByIdDto } from './dto';
import { ERROR } from '../enum';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  // create a project
  createProject(userId: number, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        ...dto,
        ownerId: userId,
        githubProfileId: dto.githubProfileId || null,
      },
    });
  }

  // TODO: review this
  // TODO: if the user tries to access a project connected to a github repo
  // user must be connected to github first
  // if user do not have a github profile they cannot view the content of the project such as project files etc
  // view project using id
  async getProjectById(userId: number, projectId: number) {
    const _project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
      },
      include: {
        tasks: true,
        owner: true,
        members: true,
        githubProfile: true,
      },
    });

    if (!_project) throw new NotFoundException(ERROR.RESOURCE_NOT_FOUND);

    if (_project.ownerId !== userId)
      throw new ForbiddenException(ERROR.ACCESS_DENIED);

    return _project;
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
        githubProfile: true,
      },
    });
  }

  // update a project using id
  async updateProjectById(
    userId: number,
    projectId: number,
    dto: UpdateProjectByIdDto,
  ) {
    const _project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });

    if (!_project) throw new NotFoundException(ERROR.RESOURCE_NOT_FOUND);

    if (_project.ownerId !== userId)
      throw new ForbiddenException(ERROR.ACCESS_DENIED);

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

    if (!_project) throw new NotFoundException(ERROR.RESOURCE_NOT_FOUND);

    if (_project.ownerId !== userId)
      throw new ForbiddenException(ERROR.ACCESS_DENIED);

    await this.prisma.project.delete({
      where: {
        id: _project.id,
      },
    });
  }
}
