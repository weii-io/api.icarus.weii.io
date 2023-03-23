import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { initUser } from './const';

describe('Project Module (e2e)', () => {
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
    };
    const user2 = {
      email: 'test2@test2.com',
      password: 'Test@12345',
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

    it('should throw a 403 since user 2 is trying to delete user 1 project', async () => {
      await pactum
        .spec()
        .delete('/projects/{id}')
        .withPathParams('id', '$S{User1_FirstProjectId}')
        .withHeaders('cookie', user2_credential_cookie)
        .expectStatus(403);
    });

    it('should throw a 403 since user 2 is trying to get user 1 project', async () => {
      await pactum
        .spec()
        .get('/projects/{id}')
        .withPathParams('id', '$S{User1_FirstProjectId}')
        .withHeaders('cookie', user2_credential_cookie)
        .expectStatus(403);
    });

    it('should throw a 403 since user 2 is trying to update user 1 project', async () => {
      await pactum
        .spec()
        .patch('/projects/{id}')
        .withPathParams('id', '$S{User1_FirstProjectId}')
        .withHeaders('cookie', user2_credential_cookie)
        .withBody({
          name: 'Test Project User 1 Updated',
        })
        .expectStatus(403);
    });

    it('should update user 1 project name, description', async () => {
      await pactum
        .spec()
        .patch('/projects/{id}')
        .withPathParams('id', '$S{User1_FirstProjectId}')
        .withHeaders('cookie', user1_credential_cookie)
        .withBody({
          name: 'Test Project User 1 Updated',
          description: 'This is a test project',
        })
        .expectStatus(200);
    });

    it('should get user 1 project by id with updated name and description', async () => {
      await pactum
        .spec()
        .get('/projects/{id}')
        .withPathParams('id', '$S{User1_FirstProjectId}')
        .withHeaders('cookie', user1_credential_cookie)
        .expectStatus(200)
        .expectJsonLike({
          name: 'Test Project User 1 Updated',
          description: 'This is a test project',
        });
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

    it('should show user 2 is a project member of project created by user 1', async () => {
      await pactum
        .spec()
        .get('/projects/{id}')
        .withPathParams('id', '$S{User1_FirstProjectId}')
        .withHeaders('cookie', user1_credential_cookie)
        .expectStatus(200)
        .expectJsonLike({
          members: [
            {
              email: user2.email,
            },
          ],
        });
    });

    // place all test above this
    it('should delete user 1 project', async () => {
      await pactum
        .spec()
        .delete('/projects/{id}')
        .withPathParams('id', '$S{User1_FirstProjectId}')
        .withHeaders('cookie', user1_credential_cookie)
        .expectStatus(200);
    });

    it('should throw a 404 since user 1 project is deleted', async () => {
      await pactum
        .spec()
        .get('/projects/{id}')
        .withPathParams('id', '$S{User1_FirstProjectId}')
        .withHeaders('cookie', user1_credential_cookie)
        .expectStatus(404);
    });
  });
});
