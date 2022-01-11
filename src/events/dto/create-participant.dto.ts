import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateParticipantDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsDateString()
  @IsOptional()
  date: Date;

  @IsBoolean()
  @IsOptional()
  has_participated: boolean;
}
