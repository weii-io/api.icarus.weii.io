import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import {
  CreateTaskDto,
  DeleteTaskByIdDto,
  GetTaskByIdDto,
  GetTasksDto,
  UpdateTaskByIdDto,
} from './dto';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  @UseGuards(JwtGuard)
  createTask(@GetUser('id') userId: number, @Body() dto: CreateTaskDto) {
    return this.taskService.createTask(userId, dto);
  }

  @Get()
  @UseGuards(JwtGuard)
  getTasks(@GetUser('id') userId: number, @Body() dto: GetTasksDto) {
    return this.taskService.getTasks(userId, dto.projectId);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  getTaskById(
    @GetUser('id') userId: number,
    @Body() dto: GetTaskByIdDto,
    @Param('id', ParseIntPipe) taskId: number,
  ) {
    return this.taskService.getTaskById(userId, dto.projectId, taskId);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  updateTaskById(
    @GetUser('id') userId: number,
    @Body() dto: UpdateTaskByIdDto,
    @Param('id', ParseIntPipe) taskId: number,
  ) {
    return this.taskService.updateTaskById(userId, taskId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  deleteTaskById(
    @GetUser('id') userId: number,
    @Body() dto: DeleteTaskByIdDto,
    @Param('id', ParseIntPipe) taskId: number,
  ) {
    return this.taskService.deleteTaskById(userId, taskId, dto);
  }
}
