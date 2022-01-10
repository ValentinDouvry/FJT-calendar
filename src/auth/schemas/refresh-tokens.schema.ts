import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({ collection: 'refresh_tokens' })
export class RefreshToken {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  refresh_token: string;

  @Prop({ required: true })
  is_revoked: boolean;

  @Prop({ required: true })
  create_date: Date;

  @Prop({ required: true })
  expires_in: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
