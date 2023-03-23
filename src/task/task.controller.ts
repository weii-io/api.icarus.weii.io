import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import {
  CreateTaskDto,
  GetTaskByIdDto,
  GetTasksDto,
  UpdateTaskDto,
} from './dto';

//TODO: add controller
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
    @Param('id') taskId: number,
  ) {
    return this.taskService.getTaskById(userId, dto.projectId, taskId);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  updateTaskById(
    @GetUser('id') userId: number,
    @Body() dto: UpdateTaskDto,
    @Param('id') taskId: number,
  ) {
    return this.taskService.updateTaskById(userId, taskId, dto);
  }
}
