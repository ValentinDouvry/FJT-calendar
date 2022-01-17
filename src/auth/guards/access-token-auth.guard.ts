import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class AccessTokenAuthGuard extends AuthGuard('access-token') {
  constructor(private reflector: Reflector) {
    super();
  }

  private logger = new Logger(AccessTokenAuthGuard.name);

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    this.logger.log(isPublic);

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
