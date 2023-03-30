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
import { UpdateUserByIdDto } from './dto';

@Controller('users/me')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtGuard)
  me(@GetUser() user: IUserCtx) {
    return this.userService.getUserById(user.id);
  }

  @Patch()
  @UseGuards(JwtGuard)
  updateMe(@GetUser('id') userId: number, @Body() dto: UpdateUserByIdDto) {
    return this.userService.updateUserById(userId, dto);
  }

  @Delete()
  @UseGuards(JwtGuard)
  deleteMe(@GetUser('id') userId: number) {
    return this.userService.deleteUserById(userId);
  }
}
