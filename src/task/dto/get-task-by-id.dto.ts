import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetTaskByIdDto {
  @IsNotEmpty()
  @IsNumber()
  projectId: number;
}
