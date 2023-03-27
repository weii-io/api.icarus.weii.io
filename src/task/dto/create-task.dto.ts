import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description: string;

  @IsOptional()
  @IsDateString()
  dueDate: Date;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @IsOptional()
  @IsEmail()
  assigneeEmail: string;
}
