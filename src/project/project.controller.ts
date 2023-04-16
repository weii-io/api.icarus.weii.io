import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { ProjectService } from './project.service';
import { GetUser } from '../auth/decorator';
import { CreateProjectDto, UpdateProjectByIdDto } from './dto';

@Controller('projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  // user should be able to create a project
  @Post()
  @UseGuards(JwtGuard)
  createProject(@GetUser('id') userId: number, @Body() dto: CreateProjectDto) {
    return this.projectService.createProject(userId, dto);
  }

  // use should be able to view a project using id
  @Get(':id')
  @UseGuards(JwtGuard)
  @Header('Cache-Control', 'max-age=60')
  getProjectById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) projectId: number,
  ) {
    return this.projectService.getProjectById(userId, projectId);
  }

  // user should be able to view all projects
  @Get()
  @UseGuards(JwtGuard)
  @Header('Cache-Control', 'max-age=60')
  getAllProjects(@GetUser('id') userId: number) {
    return this.projectService.getAllProjects(userId);
  }

  // user should be able to update a project using id
  @Patch(':id')
  @UseGuards(JwtGuard)
  updateProjectById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) projectId: number,
    @Body() dto: UpdateProjectByIdDto,
  ) {
    return this.projectService.updateProjectById(userId, projectId, dto);
  }

  // user should be able to delete a project using id
  @Delete(':id')
  @UseGuards(JwtGuard)
  deleteProjectById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) projectId: number,
  ) {
    return this.projectService.deleteProjectById(userId, projectId);
  }
}
