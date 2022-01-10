import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RefreshTokenRequest } from 'src/auth/types';

export const GetRefreshTokenRequest = createParamDecorator(
  (data: keyof RefreshTokenRequest | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
