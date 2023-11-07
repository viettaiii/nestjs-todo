import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InsertTodoDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  completed: boolean;
}
