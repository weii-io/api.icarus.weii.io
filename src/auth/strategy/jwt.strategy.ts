import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as cookie from 'cookie';
import { PrismaService } from '../../prisma/prisma.service';
import { IUserCtx } from '../../interface';
import { ERROR } from '../../enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookies = request.headers['set-cookie'];
          if (!cookies) {
            return null;
          }
          const access_token = cookie.parse(cookies[0])['x-access'];
          return access_token;
        },
      ]),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: IUserCtx) {
    const _user = await this.prisma.user.findFirst({
      where: { id: payload.id },
    });

    if (
      !_user ||
      _user.email !== payload.email ||
      _user.password !== payload.hash
    )
      throw new ForbiddenException(ERROR.ACCESS_DENIED);

    return payload;
  }
}
