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
      },
    });
  }

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

    if (dto.memberEmail) {
      const member = await this.prisma.user.findFirst({
        where: {
          email: dto.memberEmail,
        },
      });

      if (!member) throw new NotFoundException(ERROR.RESOURCE_NOT_FOUND);

      delete dto.memberEmail;
      return this.prisma.project.update({
        where: {
          id: _project.id,
        },
        data: {
          ...dto,
          members: {
            connect: {
              id: member.id,
            },
          },
        },
      });
    }

    if (dto.removeMemberEmail) {
      const member = await this.prisma.user.findFirst({
        where: {
          email: dto.removeMemberEmail,
        },
      });

      if (!member) throw new NotFoundException(ERROR.RESOURCE_NOT_FOUND);

      delete dto.removeMemberEmail;
      return this.prisma.project.update({
        where: {
          id: _project.id,
        },
        data: {
          ...dto,
          members: {
            disconnect: {
              id: member.id,
            },
          },
        },
      });
    }

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
