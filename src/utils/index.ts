import { IUserCtx } from '../interface';
import * as jwt from 'jsonwebtoken';

export const tokenIsExpired = (exp: number) => {
  if (exp > Date.now() / 1000) {
    return false;
  }
  return true;
};

export const createAccessToken = (user: IUserCtx) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_TTL,
  });
};

export const createRefreshToken = (user: IUserCtx) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_TTL,
  });
};
