import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AdminDecorator = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (data) {
      return request.user[data];
    }

    return request.user;
  },
);
