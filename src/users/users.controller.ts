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
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/decorators/public.decorator';
import { ChangePasswordDto, ForgetPasswordDto, ResetPasswordDto } from './dto';
import { GetAccesTokenPayload } from 'src/decorators';
import { HasRole } from 'src/decorators/has-role.decorator';
import { Roles } from './enums';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private readonly logger = new Logger(UsersController.name);

  @HttpCode(HttpStatus.OK)
  @HasRole(Roles.Admin)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
  @Post('forget-password')
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.usersService.forgetPassword(forgetPasswordDto);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Patch('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPasswordDto);
  }
}
