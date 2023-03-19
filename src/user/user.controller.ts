import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { IUserCtx } from '../interface';

@Controller('users')
export class UserController {
  @Get('me')
  @UseGuards(JwtGuard)
  me(@GetUser() user: IUserCtx) {
    return user;
  }
}
