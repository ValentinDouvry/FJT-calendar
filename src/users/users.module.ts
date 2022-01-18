import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ForgetPassword,
  ForgetPasswordSchema,
  User,
  UserSchema,
} from './schemas';
import { RolesGuard } from 'src/auth/guards';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: ForgetPassword.name, schema: ForgetPasswordSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
