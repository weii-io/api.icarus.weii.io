import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGithubProfileDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  accessToken: string;
}
