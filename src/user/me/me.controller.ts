import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user.service';
import { GetUser } from '../../auth/decorator';
import { JwtGuard } from '../../auth/guard';
import { IUserCtx } from '../../interface';
import { UpdateUserByIdDto } from '../dto';

@Controller()
export class MeController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtGuard)
  @Header('Cache-Control', 'max-age=60')
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
