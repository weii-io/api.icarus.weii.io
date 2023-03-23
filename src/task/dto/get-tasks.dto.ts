import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetTasksDto {
  @IsNotEmpty()
  @IsNumber()
  projectId: number;
}
