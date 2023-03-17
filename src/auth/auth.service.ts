import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

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
    this.prisma.user
      .findUniqueOrThrow({
        where: { email: dto.email },
      })
      .then(async (user) => {
        const validPassword = await argon2.verify(user.password, dto.password);
        if (!validPassword) throw new Error('Invalid password');
        return user;
      })
      .catch((error) => {
        if (error.code === 'P2025') throw new Error('User not found');
      });
  }
}
