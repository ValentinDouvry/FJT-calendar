import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { Status } from 'src/users/enums/status.enum';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
    };
  }
}
