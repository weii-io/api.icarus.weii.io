import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { CreateTaskDto, UpdateTaskByIdDto } from './dto';

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
  getTasks(
    @GetUser('id') userId: number,
    @Query('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.taskService.getTasks(userId, projectId);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  getTaskById(
    @GetUser('id') userId: number,
    @Query('projectId') projectId: number,
    @Param('id', ParseIntPipe) taskId: number,
  ) {
    return this.taskService.getTaskById(userId, projectId, taskId);
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
    @Query('projectId', ParseIntPipe) projectId: number,
    @Param('id', ParseIntPipe) taskId: number,
  ) {
    return this.taskService.deleteTaskById(userId, taskId, projectId);
  }
}
