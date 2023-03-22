import { Injectable } from '@nestjs/common';
import { IUserCtx } from '../../interface';
import * as jwt from 'jsonwebtoken';
import { TokenType } from '../../enum';

@Injectable()
export class TokenService {
  generateToken(T: TokenType, payload: IUserCtx) {
    switch (T) {
      case TokenType.ACCESS:
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: process.env.ACCESS_TOKEN_TTL,
        });
      case TokenType.REFRESH:
        return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
          expiresIn: process.env.REFRESH_TOKEN_TTL,
        });
    }
  }
}
