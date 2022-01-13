import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Status } from '../enums/status.enum';
import { Comments, Participants } from '../schemas/event.schema';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  created_date: Date;

  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  update_date: Date;

  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  deleted_date: Date;

  @IsBoolean()
  @IsOptional()
  is_deleted: boolean;

  @IsBoolean()
  @IsOptional()
  is_confirmed: boolean;

  @IsNotEmpty()
  @IsDateString()
  start_date: Date;

  @IsNotEmpty()
  @IsDateString()
  end_date: Date;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  organizer_id: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  proposed_by: string;

  @IsArray()
  @IsOptional()
  participants: [Participants];

  @IsArray()
  @IsOptional()
  comments: [Comments];

  @IsString()
  @IsEnum(Status)
  @IsOptional()
  status: string;
}
