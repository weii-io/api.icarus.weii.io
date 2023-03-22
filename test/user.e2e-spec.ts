import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { initUser, loginUser } from './const';

describe('User Module (e2e)', () => {
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
    const user = {
      email: 'test@test.com',
      password: 'Test@12345',
    };
    let credential_cookie: string;

    it('should initialize user', async () => {
      credential_cookie = await initUser(pactum, user);
      expect(credential_cookie).toBeDefined();
    });

    it('should update user email', async () => {
      user.email = 'update@update.com';

      await pactum
        .spec()
        .patch('/users/me')
        .withHeaders('cookie', credential_cookie)
        .withBody({
          email: user.email,
        })
        .expectStatus(200);
    });

    it('should throw a 403 since user data changed', async () => {
      await pactum
        .spec()
        .delete('/users/me')
        .withHeaders('cookie', credential_cookie)
        .expectStatus(403);
    });

    it('should relogin user and give them a new cookie', async () => {
      credential_cookie = await loginUser(pactum, user);
      expect(credential_cookie).toBeDefined();
    });

    it('should delete user', async () => {
      await pactum
        .spec()
        .delete('/users/me')
        .withHeaders('cookie', credential_cookie)
        .expectStatus(200);
    });

    it('should not be able to login user since user does not exist', async () => {
      await pactum.spec().post('/auth/login').withBody(user).expectStatus(404);
    });
  });
});
