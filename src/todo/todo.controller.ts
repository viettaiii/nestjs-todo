import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { InsertTodoDTO } from './dto';

import { GetUser } from '../auth/decorator';
import { UpdateTodoDTO } from './dto/updateTodo.dto';
import { MyAuthGuard } from '../auth/gruad';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Todos')
@ApiBearerAuth()
@Controller('todos')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @UseGuards(MyAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Insert new a todo' })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  insertTodo(
    @GetUser('id') userId: number,
    @Body()
    insertTodoDTO: InsertTodoDTO,
  ) {
    return this.todoService.insertTodo(userId, insertTodoDTO);
  }

  @UseGuards(MyAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get all todos me' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getTodosMe(@GetUser('id') userId: number) {
    return this.todoService.getTodosMe(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get todo detail' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  getTodoById(@Param('id', ParseIntPipe) todoId: number) {
    return this.todoService.getTodoById(todoId);
  }

  @UseGuards(MyAuthGuard)
  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a todo ' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  patchTodoById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) todoId: number,
    @Body()
    updateTodoDTO: UpdateTodoDTO,
  ) {
    return this.todoService.patchTodoById(userId, todoId, updateTodoDTO);
  }

  @UseGuards(MyAuthGuard)
  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  deleteTodoById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) todoId: number,
  ) {
    return this.todoService.deleteTodoById(userId, todoId);
  }
}
