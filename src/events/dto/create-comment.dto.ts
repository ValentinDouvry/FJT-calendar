import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsDateString()
  @IsOptional()
  created_date: Date;

  @IsDateString()
  @IsOptional()
  update_date: Date;

  @IsDateString()
  @IsOptional()
  deleted_date: Date;

  @IsBoolean()
  @IsOptional()
  is_deleted: boolean;
}
