import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

//TODO: add module
@Module({
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
