import {
  Controller,
  Post,
  UseGuards,
  Request,
  Logger,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { GetAccesTokenPayload, GetRefreshTokenRequest } from 'src/decorators';
import { HasRole } from 'src/decorators/has-role.decorator';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/users/enums';
import { User } from 'src/users/schemas/user.schema';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/intex';
import { RegisterDto } from './dto/register.dto';
import { RolesGuard } from './guards';
import { RefreshTokenAuth } from './guards/refresh-token-auth.guard';
import { LoginTokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private readonly logger = new Logger(AuthController.name);

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginTokens> {
    return await this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  lougout(@GetAccesTokenPayload('token_id') at: string) {
    return this.authService.logout(at);
  }

  @Public()
  @UseGuards(RefreshTokenAuth)
  @HttpCode(HttpStatus.CREATED)
  @Post('refresh')
  refreshTokens(@GetRefreshTokenRequest('refresh_token') rt: string) {
    return this.authService.refresh(rt);
  }

  @HasRole(Roles.Admin)
  @HttpCode(HttpStatus.ACCEPTED)
  @Patch('revoke-token/:user_id')
  revokeToken(@Param('user_id') userId: string) {
    return this.authService.revokeTokenForUser(userId);
  }
}
