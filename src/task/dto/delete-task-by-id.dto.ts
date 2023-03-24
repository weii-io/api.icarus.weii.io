import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteTaskByIdDto {
  @IsNotEmpty()
  @IsNumber()
  projectId: number;
}
