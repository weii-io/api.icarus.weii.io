import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UpdateUserByIdDto {
  @IsEmail()
  @IsString()
  @IsOptional()
  email?: string;

  @IsStrongPassword()
  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  googleProfileId?: string;
}
