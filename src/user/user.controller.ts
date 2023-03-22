import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { IUserCtx } from '../interface';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(JwtGuard)
  me(@GetUser() user: IUserCtx) {
    return user;
  }

  @Patch('me')
  @UseGuards(JwtGuard)
  updateMe(@GetUser('id') userId: number, @Body() dto: UpdateUserDto) {
    return this.userService.updateUserById(userId, dto);
  }

  @Delete('me')
  @UseGuards(JwtGuard)
  deleteMe(@GetUser('id') userId: number) {
    return this.userService.deleteUserById(userId);
  }
}
