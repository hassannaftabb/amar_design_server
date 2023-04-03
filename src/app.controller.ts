import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Project } from './user/entities/project.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('projects/all')
  getAllProjects(): Promise<Project[]> {
    return this.appService.getAllProjects();
  }
}
