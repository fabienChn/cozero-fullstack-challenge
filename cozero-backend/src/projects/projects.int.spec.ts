import * as supertest from 'supertest';
import { generateAccessToken, initTestServer } from '../test-setup';
import { INestApplication } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

const projectDataFaker = (data: any) => ({
  listing: [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Donec auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nunc nisl eget nisl.',
    'Donec auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nunc nisl eget nisl.',
  ],
  owner: 'John Doe',
  co2EstimateReduction: [100, 200],
  ...data,
});

describe('ProjectsController', () => {
  let app: INestApplication;
  let projectRepository;
  let accessToken: string;

  beforeEach(async () => {
    app = await initTestServer();
    await app.init();

    projectRepository = app.get('ProjectRepository');

    accessToken = await generateAccessToken(app.get(AuthService));

    await projectRepository.clear();

    await projectRepository.save([
      projectDataFaker({
        name: 'Project 1',
        description: 'The description',
      }),
      projectDataFaker({
        name: 'Project 2',
        description: 'The description',
      }),
      projectDataFaker({
        name: 'Project 3',
        description: 'A different description',
      }),
    ]);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('findAll', () => {
    it('returns all projects', async () => {
      return supertest(app.getHttpServer())
        .get('/projects')
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBe(3);
        });
    });

    describe('when a search query parameter is given', () => {
      describe('when the search matches some project names', () => {
        it('returns projects with names matching the search', async () => {
          return supertest(app.getHttpServer())
            .get('/projects')
            .query({ searchQuery: 'project1' })
            .expect(200)
            .then((res) => {
              expect(res.body.length).toBe(1);
              expect(res.body[0].name).toBe('Project 1');
            });
        });
      });

      describe('when the search matches some project description', () => {
        it('returns projects with descriptions matching the search', async () => {
          return supertest(app.getHttpServer())
            .get('/projects')
            .query({ searchQuery: 'The Description' })
            .expect(200)
            .then((res) => {
              expect(res.body.length).toBe(2);
              expect(res.body[0].name).toBe('Project 1');
              expect(res.body[1].name).toBe('Project 2');
            });
        });
      });
    });
  });

  describe('when the showDelete query parameter is true', () => {
    it('returns soft deleted projects only', async () => {
      const [firstProject] = await projectRepository.find();

      projectRepository.softDelete(firstProject.id);

      return supertest(app.getHttpServer())
        .get('/projects')
        .query({ showDeleted: true })
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBe(1);
          expect(res.body[0].id).toBe(firstProject.id);
        });
    });
  });

  describe('create', () => {
    it('creates a project', () => {
      return supertest(app.getHttpServer())
        .post('/projects/create')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(
          projectDataFaker({
            name: 'Project 4',
            description: 'A different description',
          }),
        )
        .expect(201);
    });

    describe('when the listing is not given', () => {
      it('prevents the project creation', () => {
        return supertest(app.getHttpServer())
          .post('/projects/create')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            name: 'Project 4',
            description: 'A different description',
            owner: 'John Doe',
            co2EstimateReduction: [100, 200],
            listing: [],
          })
          .expect(400);
      });
    });
  });

  describe('delete', () => {
    it('soft deletes the project', async () => {
      const [firstProject] = await projectRepository.find();

      await supertest(app.getHttpServer())
        .delete(`/projects/${firstProject.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      const nonexistantProject = await projectRepository.findOne({
        where: { id: firstProject.id },
      });

      expect(nonexistantProject).toBe(null);

      const deletedProject = await projectRepository.findOne({
        where: { id: firstProject.id },
        withDeleted: true,
      });

      expect(deletedProject.id).toBe(firstProject.id);
    });
  });

  describe('restore', () => {
    it('restores the soft deleted project', async () => {
      const softdeletedProject = await projectRepository.save(
        projectDataFaker({
          name: 'Project 5',
          description: 'A different description',
          deletedAt: Date.now().toString(),
        }),
      );

      await supertest(app.getHttpServer())
        .patch(`/projects/${softdeletedProject.id}/restore`)
        .set('Authorization', `Bearer ${accessToken}`);

      const restoredProject = await projectRepository.findOne({
        where: { id: softdeletedProject.id },
      });

      expect(restoredProject.id).toBe(softdeletedProject.id);
    });
  });
});
