import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

//TODO: add module
@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
