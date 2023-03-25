import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto';
import { LoginUserDto } from './dto';
import { TokenService } from './token/token.service';
import * as argon2 from 'argon2';
import { ERROR, TokenType } from '../enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prismaService: PrismaService,
    private tokenService: TokenService,
  ) {}

  async register(dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  async login(dto: LoginUserDto) {
    const _user = await this.prismaService.user.findFirst({
      where: { email: dto.email },
    });

    if (!_user) {
      throw new NotFoundException(ERROR.INVALID_CREDENTIALS);
    }

    const passwordMatch = await argon2.verify(_user.password, dto.password);

    if (!passwordMatch) {
      throw new NotFoundException(ERROR.INVALID_CREDENTIALS);
    }

    return {
      access_token: this.tokenService.generateToken(TokenType.ACCESS, {
        id: _user.id,
        username: _user.username,
        email: _user.email,
        hash: _user.password,
        firstName: _user.firstName,
        lastName: _user.lastName,
      }),
      refresh_token: this.tokenService.generateToken(TokenType.REFRESH, {
        id: _user.id,
        username: _user.username,
        email: _user.email,
        hash: _user.password,
        firstName: _user.firstName,
        lastName: _user.lastName,
      }),
    };
  }
}
