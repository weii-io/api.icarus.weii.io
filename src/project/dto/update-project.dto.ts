import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  memberEmail: string;
}
