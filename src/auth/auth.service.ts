import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { Status } from 'src/users/enums/status.enum';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schemas/refresh-tokens.schema';
import { isValidObjectId, Model } from 'mongoose';
import { LoginTokens } from './types';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (
      user &&
      (await compare(pass, user.password)) &&
      user.status === Status.Accepted
    ) {
      const sanitized = user.toObject();
      delete sanitized['password'];
      return sanitized;
    }
    return null;
  }

  async register(registerDto: RegisterDto): Promise<any> {
    return this.usersService.create(registerDto);
  }

  async login(loginDto: LoginDto): Promise<LoginTokens> {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    if (
      !user ||
      user.status !== Status.Accepted ||
      !(await compare(loginDto.password, user.password))
    ) {
      throw new HttpException('Accès non autorisé', HttpStatus.FORBIDDEN);
    }

    const refreshToken = await this.getRefreshToken(user._id);

    const refreshTokenSaved = await this.saveRefreshToken(
      user._id,
      refreshToken,
    );

    const accessToken = await this.getAccessToken(
      user._id,
      user.roles,
      refreshTokenSaved._id,
    );

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async logout(tokenId: string): Promise<any> {
    if (!isValidObjectId(tokenId)) {
      throw new HttpException('Token incorrect', HttpStatus.FORBIDDEN);
    }

    const revokedToken = await this.refreshTokenModel.updateOne(
      { _id: tokenId },
      { is_revoked: true },
    );

    return revokedToken;
  }

  async refresh(refreshToken: string): Promise<any> {
    this.logger.log(refreshToken);
    const token = await this.refreshTokenModel.findOne({
      refresh_token: refreshToken,
      is_revoked: false,
    });

    if (!token) {
      throw new HttpException('Refresh token non valid', HttpStatus.FORBIDDEN);
    }

    if (!isValidObjectId(token.user_id)) {
      await this.refreshTokenModel.updateOne(
        { _id: token._id },
        { is_revoked: true },
      );
      throw new HttpException('Refresh token non valid', HttpStatus.FORBIDDEN);
    }

    const user = await this.usersService.findOne(token.user_id);
    if (!user) {
      await this.refreshTokenModel.updateOne(
        { _id: token._id },
        { is_revoked: true },
      );
      throw new HttpException('Refresh token non valid', HttpStatus.FORBIDDEN);
    }

    const accessToken = await this.getAccessToken(
      token.user_id,
      user.roles,
      token._id,
    );

    return { access_token: accessToken };
  }

  async revokeTokenForUser(userId: string): Promise<any> {
    if (!isValidObjectId(userId)) {
      throw new HttpException('UserId incorrect', HttpStatus.FORBIDDEN);
    }

    return this.refreshTokenModel.updateMany(
      { user_id: userId },
      { is_revoked: true },
    );
  }

  async getRefreshToken(userId: string): Promise<string> {
    const token = await this.jwtService.signAsync(
      { sub: userId },
      {
        secret: this.config.get<string>('jwt.refresh.secret'),
        expiresIn: this.config.get<string>('jwt.refresh.expire_time'),
      },
    );

    return token;
  }

  async getAccessToken(
    userId: string,
    roles: string[],
    tokenId: string,
  ): Promise<string> {
    const token = await this.jwtService.signAsync(
      {
        sub: userId,
        token_id: tokenId,
        roles: roles,
      },
      {
        secret: this.config.get<string>('jwt.access.secret'),
        expiresIn: this.config.get<string>('jwt.access.expire_time'),
      },
    );

    return token;
  }

  async saveRefreshToken(userId: string, token: string): Promise<any> {
    const decode = this.jwtService.decode(token, { json: true });

    const saveToken = {
      user_id: userId,
      refresh_token: token,
      is_revoked: false,
      create_date: new Date(parseInt(decode['iat'], 10) * 1000),
      expires_in: new Date(parseInt(decode['exp'], 10) * 1000),
    };

    return await new this.refreshTokenModel(saveToken).save();
  }

  message(): string {
    this.logger.verbose(this.config.get<string>('jwt.access.secret'));
    this.logger.verbose(this.config.get<string>('jwt.access.expire_time'));
    this.logger.verbose(this.config.get<string>('jwt.refresh.secret'));
    this.logger.verbose(this.config.get<string>('jwt.refresh.expire_time'));
    return 'message service';
  }
}
