import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Raw, Repository } from 'typeorm';
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

  async findAll(searchQuery?: string, showDeleted = false): Promise<Project[]> {
    let queryBuilder = this.projectsRepository.createQueryBuilder('p');

    if (showDeleted) {
      queryBuilder = queryBuilder
        .withDeleted()
        .where('p.deletedAt IS NOT NULL');
    }

    if (searchQuery && searchQuery.length > 0) {
      const spacelessSearch = searchQuery.replace(' ', '');

      queryBuilder = queryBuilder.andWhere(
        `REPLACE(p.name, " ", "") LIKE "%${spacelessSearch}%" OR REPLACE(p.description, " ", "") LIKE "%${spacelessSearch}%"`,
      );
    }

    return queryBuilder.getMany();
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
