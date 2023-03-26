import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateUserDto } from '../user/dto';
import { LoginUserDto } from './dto';

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
    });
    res.cookie('x-refresh', refresh_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return res.send();
  }
}
