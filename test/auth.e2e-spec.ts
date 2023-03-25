import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';

describe('Auth Module (e2e)', () => {
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
    await app.listen(process.env.PORT_NUMBER);
    pactum.request.setBaseUrl(process.env.BASE_URL);
  });

  afterAll(() => {
    app.close();
  });

  describe('User Authentication', () => {
    const user = {
      email: 'test@test.com',
      password: 'Test@12345',
      confirmPassword: 'Test@12345',
      firstName: 'Test',
      lastName: 'User',
    };

    let access_token: string;
    let refresh_token: string;

    it('should throw a 400 if email is not provided', async () => {
      const payload = {
        password: user.password,
      };
      await pactum
        .spec()
        .post('/auth/register')
        .withBody(payload)
        .expectStatus(400);
    });

    it('should throw a 400 if password is not provided', async () => {
      const payload = {
        email: user.email,
      };
      await pactum
        .spec()
        .post('/auth/register')
        .withBody(payload)
        .expectStatus(400);
    });

    it('should register user', async () => {
      await pactum
        .spec()
        .post('/auth/register')
        .withBody(user)
        .expectStatus(201);
    });

    it('should return a 400 if email is not provided', async () => {
      const payload = {
        password: user.password,
      };
      await pactum

        .spec()
        .post('/auth/login')
        .withBody(payload)
        .expectStatus(400);
    });

    it('should return a 400 if password is not provided', async () => {
      const payload = {
        email: user.email,
      };
      await pactum

        .spec()
        .post('/auth/login')
        .withBody(payload)
        .expectStatus(400);
    });

    it('should return a 404 if email is wrong', async () => {
      const payload = {
        email: 'wrongemail@test.com',
        password: user.password,
      };
      await pactum

        .spec()
        .post('/auth/login')
        .withBody(payload)
        .expectStatus(404);
    });

    it('should return a 404 if email is wrong', async () => {
      const payload = {
        email: user.email,
        password: 'wrongpassword',
      };
      await pactum

        .spec()
        .post('/auth/login')
        .withBody(payload)
        .expectStatus(404);
    });

    it('should store cookies', async () => {
      const payload = {
        email: user.email,
        password: user.password,
      };

      access_token = await pactum
        .spec()
        .post('/auth/login')
        .withBody(payload)
        .returns((ctx) => {
          return ctx.res.headers['set-cookie'][0];
        });
      refresh_token = await pactum
        .spec()
        .post('/auth/login')
        .withBody(payload)
        .returns((ctx) => {
          return ctx.res.headers['set-cookie'][1];
        });
      expect(access_token).toBeDefined();
      expect(refresh_token).toBeDefined();
    });

    it('should return user details', async () => {
      await pactum
        .spec()
        .get('/users/me')
        .withHeaders('cookie', [access_token, refresh_token])
        .expectStatus(200);
    });

    it('should throw unauthorized error', async () => {
      await pactum.spec().get('/users/me').expectStatus(401);
    });
  });
});
