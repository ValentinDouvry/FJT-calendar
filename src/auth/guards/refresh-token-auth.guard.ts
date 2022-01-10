import { AuthGuard } from '@nestjs/passport';

export class RefreshTokenAuth extends AuthGuard('refresh-token') {
  constructor() {
    super();
  }
}
