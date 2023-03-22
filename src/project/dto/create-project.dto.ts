import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @MaxLength(200)
  description?: string;
}
