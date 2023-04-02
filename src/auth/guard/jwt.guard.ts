import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as cookie from 'cookie';
import * as jwt from 'jsonwebtoken';
import { ERROR } from '../../enum';
import { createAccessToken, tokenIsExpired } from '../../utils';

export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any, _info: any, context: ExecutionContext) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || _info || !user) {
      throw new UnauthorizedException();
    }

    // check if the access token is expired
    const request = context.switchToHttp().getRequest();
    const cookies = cookie.parse(request.headers['cookie']);
    if (!cookies) {
      throw new UnauthorizedException(ERROR.INVALID_COOKIE);
    }
    const raw_access_token = cookies['x-access'];
    const decoded_access_token = jwt.decode(raw_access_token) as jwt.JwtPayload;
    if (tokenIsExpired(decoded_access_token.exp)) {
      // check if the refresh token is expired
      const raw_refresh_token = cookies['x-refresh'];
      const decoded_refresh_token = jwt.decode(
        raw_refresh_token,
      ) as jwt.JwtPayload;
      if (tokenIsExpired(decoded_refresh_token.exp)) {
        throw new UnauthorizedException(ERROR.REFRESH_TOKEN_EXPIRED);
      }

      // refresh the access token
      delete user.exp;
      delete user.iat;
      const new_access_token = createAccessToken(user);
      request.res.setHeader(
        'cookie',
        cookie.serialize('x-access', new_access_token, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          domain: process.env.NODE_ENV === 'prod' ? '.weii.io' : 'localhost',
        }),
      );
    }
    return user;
  }
}
