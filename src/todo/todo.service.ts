import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InsertTodoDTO } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTodoDTO } from './dto/updateTodo.dto';
import { Todo } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private prismaService: PrismaService) {}
  async insertTodo(userId: number, insertTodoDTO: InsertTodoDTO) {
    const todo = await this.prismaService.todo.create({
      data: { userId, ...insertTodoDTO },
    });
    return todo;
  }

  async getTodosMe(userId: number) {
    return await this.prismaService.todo.findMany({ where: { userId } });
  }

  async getTodoById(todoId: number) {
    return await this.prismaService.todo.findFirst({ where: { id: todoId } });
  }

  async patchTodoById(
    userId: number,
    todoId: number,
    updateTodoDTO: UpdateTodoDTO,
  ) {
    const todo = await this.findTodoById(todoId);
    this.checkPermission(userId, todo.userId);
    return await this.prismaService.todo.update({
      where: { userId, id: todoId },
      data: { ...updateTodoDTO },
    });
  }

  async deleteTodoById(userId: number, todoId: number) {
    const todo = await this.findTodoById(todoId);
    this.checkPermission(userId, todo.userId);
    return this.prismaService.todo.delete({ where: { userId, id: todoId } });
  }

  async findTodoById(id: number): Promise<Todo> {
    const todo = await this.prismaService.todo.findFirst({
      where: { id },
    });
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  checkPermission(currentUserId: number, userId: number): void {
    const isSameUser = currentUserId === userId;
    if (!isSameUser) throw new ForbiddenException('Permission denied');
    return;
  }
}
