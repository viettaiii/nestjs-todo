import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
export const GetUser = createParamDecorator(
  (key: any, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return key ? user[key] : user;
  },
);
