import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InsertTodoDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;


  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  completed: boolean;
}
