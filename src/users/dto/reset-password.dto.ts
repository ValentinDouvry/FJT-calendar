import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsUUID(4)
  @IsNotEmpty()
  code_reset: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  new_password: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  confirm_password: string;
}
