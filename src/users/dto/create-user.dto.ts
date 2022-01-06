import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly first_name: string;

  @IsString()
  @IsNotEmpty()
  readonly last_name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  readonly password: string;

  @IsNumber()
  @IsNotEmpty()
  readonly room_number: number;

  @IsBoolean()
  @IsOptional()
  readonly is_deleted: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly avatar_path: string;

  @IsString()
  @IsOptional()
  readonly status: string;

  @IsArray()
  @IsOptional()
  readonly roles: [string];
}
