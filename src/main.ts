import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  console.log('Server is running on port: ' + process.env.PORT_NUMBER);
  await app.listen(process.env.PORT_NUMBER);
}
bootstrap();
