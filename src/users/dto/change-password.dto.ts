import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  old_password: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  new_password: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  confirm_password: string;
}
