import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { InsertTodoDTO } from './dto';

import { GetUser } from 'src/auth/decorator';
import { UpdateTodoDTO } from './dto/updateTodo.dto';
import { MyAuthGuard } from '../auth/gruad';
@Controller('todos')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @UseGuards(MyAuthGuard)
  @Post()
  insertTodo(
    @GetUser('id') userId: number,
    @Body()
    insertTodoDTO: InsertTodoDTO,
  ) {
    return this.todoService.insertTodo(userId, insertTodoDTO);
  }

  @UseGuards(MyAuthGuard)
  @Get('me')
  getTodosMe(@GetUser('id') userId: number) {
    return this.todoService.getTodosMe(userId);
  }

  @Get(':id')
  getTodoById(@Param('id', ParseIntPipe) todoId: number) {
    return this.todoService.getTodoById(todoId);
  }

  @UseGuards(MyAuthGuard)
  @Patch(':id')
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
  deleteTodoById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) todoId: number,
  ) {
    return this.todoService.deleteTodoById(userId, todoId);
  }
}
