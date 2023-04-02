import { Module } from '@nestjs/common';
import { UserService } from '../user.service';
import { MeController } from './me.controller';

@Module({
  controllers: [MeController],
  providers: [UserService],
})
export class MeModule {}
