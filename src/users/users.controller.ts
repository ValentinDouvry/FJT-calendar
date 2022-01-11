import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/decorators/public.decorator';
import { ChangePasswordDto, ForgetPasswordDto, ResetPasswordDto } from './dto';
import { GetAccesTokenPayload } from 'src/decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private readonly logger = new Logger(UsersController.name);

  @Public()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch('change-password/:id')
  changePassword(
    @Param('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @GetAccesTokenPayload('sub') userIdToken: string,
  ) {
    if (userId !== userIdToken) {
      throw new HttpException(
        'Interdiction de modifier le mot de passe',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.usersService.changePassword(userId, changePasswordDto);
  }

  @Public()
  @Post('forget-password')
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.usersService.forgetPassword(forgetPasswordDto);
  }

  @Public()
  @Patch('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPasswordDto);
  }
}
