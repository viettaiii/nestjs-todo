import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  completed: boolean;
}
