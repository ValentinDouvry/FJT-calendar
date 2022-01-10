import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Roles, Status } from 'src/users/enums';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  confirme_password: string;

  @IsNumber()
  @IsNotEmpty()
  room_number: number;

  @IsBoolean()
  @IsOptional()
  is_deleted: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  avatar_path: string;

  @IsString()
  @IsEnum(Status)
  @IsOptional()
  status: string;

  @IsArray()
  @IsEnum(Roles, { each: true })
  @IsOptional()
  roles: [string];
}
