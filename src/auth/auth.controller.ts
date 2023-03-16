import { Controller, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('register')
  register(dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }
}
