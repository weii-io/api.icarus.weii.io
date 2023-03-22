import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsString()
  @IsOptional()
  email?: string;

  @IsStrongPassword()
  @IsString()
  @IsOptional()
  password?: string;
}
