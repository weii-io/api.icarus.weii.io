import { Global, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { chance } from '../lib/chance';
import * as argon2 from 'argon2';

@Global()
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async createUser(dto: CreateUserDto) {
    let username = `${chance.word()}${chance.integer({ min: 0, max: 9999 })}`;

    // this might slow down the server but it ensures that the username is unique
    while (await this.prisma.user.findFirst({ where: { username } })) {
      username = `${chance.word()}${chance.integer({ min: 0, max: 9999 })}`;
    }

    this.prisma.user
      .create({
        data: {
          email: dto.email,
          password: await argon2.hash(dto.password),
          username: username,
        },
      })
      .then((newUser) => {
        return newUser;
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          return new Error('Email already exist');
        } else throw new Error(error);
      });
  }
}
