import {
  Body,
  Controller,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateUserDto } from '../user/dto';
import { LoginUserDto } from './dto';
import { JwtGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Res() res: Response, @Body() dto: LoginUserDto) {
    const { access_token, refresh_token } = await this.authService.login(dto);
    res.cookie('x-access', access_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      domain: process.env.NODE_ENV === 'prod' ? '.weii.io' : 'localhost',
    });
    res.cookie('x-refresh', refresh_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      domain: process.env.NODE_ENV === 'prod' ? '.weii.io' : 'localhost',
    });
    return res.send({
      login: true,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  @UseGuards(JwtGuard)
  async logout(@Res() res: Response) {
    res.clearCookie('x-access', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      domain: process.env.NODE_ENV === 'prod' ? '.weii.io' : 'localhost',
    });
    res.clearCookie('x-refresh', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      domain: process.env.NODE_ENV === 'prod' ? '.weii.io' : 'localhost',
    });
    return res.send({
      logout: true,
    });
  }
}
