import { IsString, MaxLength } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  name: string;

  @IsString()
  @MaxLength(200)
  description?: string;
}
