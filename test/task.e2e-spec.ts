import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { initUser } from './const';

describe('Task Module (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    prisma = app.get(PrismaService);
    await prisma.cleanDB();
    await app.listen(3333);
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('CRUD', () => {
    const user1 = {
      email: 'test@test.com',
      password: 'Test@12345',
      confirmPassword: 'Test@12345',
      firstName: 'Test',
      lastName: 'User',
    };
    const user2 = {
      email: 'test2@test2.com',
      password: 'Test@12345',
      confirmPassword: 'Test@12345',
      firstName: 'Test',
      lastName: 'User 2',
    };
    let user1_credential_cookie: string;
    let user2_credential_cookie: string;

    it('should initialize user', async () => {
      user1_credential_cookie = await initUser(pactum, user1);
      user2_credential_cookie = await initUser(pactum, user2);
      expect(user1_credential_cookie).toBeDefined();
      expect(user2_credential_cookie).toBeDefined();
    });

    it('should create new project for user 1', async () => {
      await pactum
        .spec()
        .post('/projects')
        .withHeaders('cookie', user1_credential_cookie)
        .withBody({
          name: 'Test Project User 1',
        })
        .expectStatus(201);
    });

    it('should get all projects for user 1', async () => {
      await pactum
        .spec()
        .get('/projects')
        .withHeaders('cookie', user1_credential_cookie)
        .expectStatus(200)
        .expectJsonLike([
          {
            name: 'Test Project User 1',
          },
        ])
        .stores('User1_FirstProjectId', '[0].id');
    });

    it('should throw a 403 error since user 2 is not a member of the project', async () => {
      await pactum
        .spec()
        .post('/tasks')
        .withHeaders('cookie', user1_credential_cookie)
        .withBody({
          name: 'Test Task User 1',
          projectId: '$S{User1_FirstProjectId}',
          assigneeEmail: user2.email,
        })
        .expectStatus(403);
    });

    it('should add user 2 to project for user 1', async () => {
      await pactum
        .spec()
        .patch('/projects/{id}')
        .withPathParams('id', '$S{User1_FirstProjectId}')
        .withHeaders('cookie', user1_credential_cookie)
        .withBody({
          memberEmail: user2.email,
        })
        .expectStatus(200);
    });

    it('should create a task and assign it to user 2', async () => {
      await pactum
        .spec()
        .post('/tasks')
        .withHeaders('cookie', user1_credential_cookie)
        .withBody({
          name: 'Test Task User 1',
          projectId: '$S{User1_FirstProjectId}',
          assigneeEmail: user2.email,
        })
        .expectStatus(201)
        .stores('User1_FirstProject_FirstTaskId', 'id');
    });

    it('should show user 2 as an assignee of the task', async () => {
      await pactum
        .spec()
        .get('/tasks')
        .withHeaders('cookie', user1_credential_cookie)
        .withBody({
          projectId: '$S{User1_FirstProjectId}',
        })
        .expectStatus(200)
        .expectJsonLike([
          {
            name: 'Test Task User 1',
            assignee: {
              email: user2.email,
            },
          },
        ]);
    });

    it('show throw a 403 error since user 2 is not the owner of the task', async () => {
      await pactum
        .spec()
        .delete('/tasks/{id}')
        .withPathParams('id', '$S{User1_FirstProject_FirstTaskId}')
        .withBody({
          projectId: '$S{User1_FirstProjectId}',
        })
        .withHeaders('cookie', user2_credential_cookie)
        .expectStatus(403);
    });

    // TODO: should be able to update task
    it('should update the task', async () => {
      await pactum
        .spec()
        .patch('/tasks/{id}')
        .withPathParams('id', '$S{User1_FirstProject_FirstTaskId}')
        .withBody({
          name: 'Test Task User 1 Updated',
          projectId: '$S{User1_FirstProjectId}',
        })
        .withHeaders('cookie', user1_credential_cookie)
        .expectStatus(200);
    });

    it('should remove the assignee', async () => {
      await pactum
        .spec()
        .patch('/tasks/{id}')
        .withPathParams('id', '$S{User1_FirstProject_FirstTaskId}')
        .withBody({
          projectId: '$S{User1_FirstProjectId}',
          removeAssigneeEmail: user2.email,
        })
        .withHeaders('cookie', user1_credential_cookie)
        .expectStatus(200);
    });

    it('should delete the task', async () => {
      await pactum
        .spec()
        .delete('/tasks/{id}')
        .withPathParams('id', '$S{User1_FirstProject_FirstTaskId}')
        .withBody({
          projectId: '$S{User1_FirstProjectId}',
        })
        .withHeaders('cookie', user1_credential_cookie)
        .expectStatus(200);
    });
  });
});
