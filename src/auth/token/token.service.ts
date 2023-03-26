import { Injectable } from '@nestjs/common';
import { IUserCtx } from '../../interface';
import { TokenType } from '../../enum';
import { createAccessToken, createRefreshToken } from '../../utils';

@Injectable()
export class TokenService {
  generateToken(T: TokenType, payload: IUserCtx) {
    switch (T) {
      case TokenType.ACCESS:
        return createAccessToken(payload);
      case TokenType.REFRESH:
        return createRefreshToken(payload);
    }
  }
}
