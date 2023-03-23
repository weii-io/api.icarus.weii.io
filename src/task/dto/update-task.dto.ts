import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description: string;

  @IsOptional()
  @IsDate()
  dueDate: Date;

  @IsOptional()
  @IsBoolean()
  completed: boolean;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @IsOptional()
  @IsString()
  @IsEmail()
  assigneeEmail: string;
}
