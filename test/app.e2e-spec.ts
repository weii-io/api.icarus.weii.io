import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';

describe('App Module (e2e)', () => {
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
  });

  afterAll(() => {
    app.close();
  });

  describe('App', () => {
    describe('make sure we use the correct env file: .env.test', () => {
      it('should return the correct env file', async () => {
        expect(process.env.NODE_ENV).toEqual('test');
        expect(process.env.PORT_NUMBER).toEqual('3333');
        expect(process.env.BASE_URL).toEqual('http://localhost:3333');
      });
    });
  });
});
