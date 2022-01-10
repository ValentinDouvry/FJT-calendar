import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
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
  @IsNotEmpty()
  organizer_id: string;

  @IsArray()
  @IsOptional()
  participants: [Participants];

  @IsArray()
  @IsOptional()
  comments: [Comments];
}
