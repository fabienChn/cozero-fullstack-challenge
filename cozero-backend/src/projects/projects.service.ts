import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    return await this.projectsRepository.save(createProjectDto);
  }

  async findAll(searchQuery?: string): Promise<Project[]> {
    if (!searchQuery) {
      return this.projectsRepository.find();
    }

    const spacelessSearch = searchQuery.replace(' ', '');

    return this.projectsRepository.find({
      where: [
        {
          name: Raw(
            (alias) => `REPLACE(${alias}, " ", "") LIKE "%${spacelessSearch}%"`,
          ),
        },
        {
          description: Raw(
            (alias) => `REPLACE(${alias}, " ", "") LIKE "%${spacelessSearch}%"`,
          ),
        },
      ],
    });
  }

  async findOne(id: number) {
    return await this.projectsRepository.findOneBy({ id });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.projectsRepository.update({ id }, updateProjectDto);
  }

  async remove(id: number) {
    return this.projectsRepository.softDelete(id);
  }

  async restore(id: number) {
    return this.projectsRepository.restore(id);
  }
}
