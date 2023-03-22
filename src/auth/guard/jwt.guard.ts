import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as cookie from 'cookie';
import * as jwt from 'jsonwebtoken';
import { ERROR } from '../../enum';
import { tokenIsExpired } from '../../utils';

export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any, _info: any, context: ExecutionContext) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    // check if the access token is expired
    const request = context.switchToHttp().getRequest();
    const cookies = request.headers['set-cookie'];
    if (!cookies) {
      throw new UnauthorizedException(ERROR.INVALID_COOKIE);
    }
    const raw_access_token = cookie.parse(cookies[0])['x-access'];
    const decoded_access_token = jwt.decode(raw_access_token) as jwt.JwtPayload;
    if (tokenIsExpired(decoded_access_token.exp)) {
      // check if the refresh token is expired
      const raw_refresh_token = cookie.parse(cookies[1])['x-refresh'];
      const decoded_refresh_token = jwt.decode(
        raw_refresh_token,
      ) as jwt.JwtPayload;
      if (tokenIsExpired(decoded_refresh_token.exp)) {
        throw new UnauthorizedException(ERROR.REFRESH_TOKEN_EXPIRED);
      }

      // refresh the access token
      const new_access_token = jwt.sign(
        { id: user.id, email: user.email, hash: user.password },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
        },
      );
      request.res.setHeader(
        'set-cookie',
        cookie.serialize('x-access', new_access_token, {
          httpOnly: true,
        }),
      );
    }

    return user;
  }
}
