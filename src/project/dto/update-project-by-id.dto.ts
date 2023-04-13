import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProjectByIdDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  description?: string;
}
