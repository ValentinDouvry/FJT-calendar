import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Roles } from '../enums/roles.enum';
import { Status } from '../enums/status.enum';

export class CreateUserDto {
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

  @IsEnum(Roles, { each: true })
  @Type()
  @IsOptional()
  roles: [string];
}
