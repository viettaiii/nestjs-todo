import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @IsBoolean()
  @IsOptional()
  completed: boolean;
}
