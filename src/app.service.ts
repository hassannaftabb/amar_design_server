import { Injectable } from '@nestjs/common';
import { Project } from './user/entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  async getAllProjects(): Promise<Project[]> {
    const allProjects = await this.projectRepository.find();
    return allProjects;
  }
}
