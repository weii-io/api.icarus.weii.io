import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto';
import { LoginUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
  ) {}

  async register(dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  async login(dto: LoginUserDto) {
    const _user = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (!_user) {
      return new Error('Invalid credentials');
    }

    const passwordMatch = await argon2.verify(_user.password, dto.password);

    if (!passwordMatch) {
      return new Error('Invalid credentials');
    }

    const token = jwt.sign(
      {
        id: _user.id,
        username: _user.username,
        email: _user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      },
    );

    return token;
  }
}
