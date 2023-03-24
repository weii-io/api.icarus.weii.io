import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto, DeleteTaskByIdDto, UpdateTaskByIdDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { ERROR } from '../enum';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}
  async createTask(userId: number, dto: CreateTaskDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
      include: {
        members: true,
      },
    });

    if (!project) {
      throw new NotFoundException(ERROR.RESOURCE_NOT_FOUND);
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException(ERROR.ACCESS_DENIED);
    }

    if (dto.assigneeEmail) {
      const assignee = await this.prisma.user.findFirst({
        where: {
          email: dto.assigneeEmail,
        },
      });

      if (!assignee) {
        throw new NotFoundException(ERROR.RESOURCE_NOT_FOUND);
      }

      // check if assignee is a member of the project
      if (
        project.members.filter((member) => member.id === assignee.id).length ===
        0
      )
        throw new ForbiddenException(ERROR.ACCESS_DENIED);

      delete dto.assigneeEmail;

      return this.prisma.task.create({
        data: {
          ...dto,
          assigneeId: assignee.id,
        },
      });
    }

    return this.prisma.task.create({
      data: {
        ...dto,
      },
    });
  }

  async getTasks(userId: number, projectId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(ERROR.RESOURCE_NOT_FOUND);
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException(ERROR.ACCESS_DENIED);
    }

    return this.prisma.task.findMany({
      where: {
        projectId,
      },
      include: {
        project: true,
        assignee: true,
      },
    });
  }

  async getTaskById(userId: number, projectId: number, taskId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: true,
        assignee: true,
      },
    });

    if (!task) {
      throw new NotFoundException(ERROR.RESOURCE_NOT_FOUND);
    }

    if (task.projectId !== projectId) {
      throw new ForbiddenException(ERROR.ACCESS_DENIED);
    }

    if (task.project.ownerId !== userId) {
      throw new ForbiddenException(ERROR.ACCESS_DENIED);
    }

    return task;
  }

  async updateTaskById(userId: number, taskId: number, dto: UpdateTaskByIdDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(ERROR.RESOURCE_NOT_FOUND);
    }

    if (task.projectId !== dto.projectId) {
      throw new ForbiddenException(ERROR.ACCESS_DENIED);
    }

    if (task.project.ownerId !== userId) {
      throw new ForbiddenException(ERROR.ACCESS_DENIED);
    }

    if (dto.assigneeEmail) {
      const assignee = await this.prisma.user.findFirst({
        where: {
          email: dto.assigneeEmail,
        },
      });

      if (!assignee) {
        throw new NotFoundException(ERROR.RESOURCE_NOT_FOUND);
      }

      if (
        task.project.members.filter((member) => member.id === assignee.id)
          .length === 0
      ) {
        throw new ForbiddenException(ERROR.ACCESS_DENIED);
      }

      delete dto.assigneeEmail;

      return this.prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          ...dto,
          assigneeId: assignee.id,
        },
      });
    }

    if (dto.removeAssigneeEmail) {
      const assignee = await this.prisma.user.findFirst({
        where: {
          email: dto.removeAssigneeEmail,
        },
      });

      if (!assignee) {
        throw new NotFoundException(ERROR.RESOURCE_NOT_FOUND);
      }

      if (task.assigneeId !== assignee.id) {
        throw new NotFoundException(ERROR.RESOURCE_NOT_FOUND);
      }

      delete dto.removeAssigneeEmail;

      return this.prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          ...dto,
          assigneeId: null,
        },
      });
    }

    return this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: dto,
    });
  }

  async deleteTaskById(userId: number, taskId: number, dto: DeleteTaskByIdDto) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId },
      include: {
        project: true,
        assignee: true,
      },
    });

    if (!task) {
      throw new NotFoundException(ERROR.RESOURCE_NOT_FOUND);
    }

    if (task.projectId !== dto.projectId) {
      throw new ForbiddenException(ERROR.ACCESS_DENIED);
    }

    if (task.project.ownerId !== userId) {
      throw new ForbiddenException(ERROR.ACCESS_DENIED);
    }

    return this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });
  }
}
