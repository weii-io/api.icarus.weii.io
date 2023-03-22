import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { TokenModule } from './token/token.module';
import { TokenService } from './token/token.service';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.ACCESS_TOKEN_SECRET }),
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy, TokenService],
})
export class AuthModule {}
