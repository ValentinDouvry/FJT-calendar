import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Roles, Status } from '../enums';

export class UpdateUserDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  room_number: number;

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
