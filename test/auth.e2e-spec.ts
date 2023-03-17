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
    await app.listen(3333);
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    it('should register user', async () => {
      const payload = {
        email: 'test@gmail.com',
        password: 'test',
      };
      await pactum
        .spec()
        .post('/auth/register')
        .withBody(payload)
        .expectStatus(201);
    });

    // it('should find newly created user', async () => {
    //   const users = await prisma.user.findUnique({
    //     where: {
    //       email: 'test@test.com',
    //     },
    //   });
    //   expect(users.email).toEqual('test@test.com');
    // });
  });
});
