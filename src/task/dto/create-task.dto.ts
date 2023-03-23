import {
  IsDate,
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
  @IsDate()
  dueDate: Date;

  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @IsOptional()
  @IsEmail()
  assigneeEmail: string;
}
