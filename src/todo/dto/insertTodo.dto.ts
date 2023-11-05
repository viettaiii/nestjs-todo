import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InsertTodoDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  @IsOptional()
  completed: boolean;
}
