import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import * as cors from 'cors';
import { RouterModule } from '@nestjs/core';
import { MeModule } from './user/me/me.module';
import { GithubProfileModule } from './github-profile/github-profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    MeModule,
    AuthModule,
    PrismaModule,
    ProjectModule,
    TaskModule,
    GithubProfileModule,
    RouterModule.register([
      {
        path: 'users',
        module: UserModule,
        children: [
          {
            path: 'me',
            module: MeModule,
            children: [
              {
                path: 'github-profile',
                module: GithubProfileModule,
              },
            ],
          },
        ],
      },
    ]),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    const options: cors.CorsOptions = {
      origin: ['http://localhost:3000', 'https://icarus.weii.io'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    };
    consumer.apply(cors(options)).forRoutes('*');
  }
}
