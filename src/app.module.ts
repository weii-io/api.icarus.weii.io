import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import * as cors from 'cors';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    ProjectModule,
    TaskModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    const options: cors.CorsOptions = {
      origin: ['http://localhost:3000', 'https://icarus.weii.io'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    };
    consumer.apply(cors(options)).forRoutes('*');
  }
}
