import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ForgetPasswordDocument = ForgetPassword & Document;

@Schema({ collection: 'forget_passwords' })
export class ForgetPassword {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true, unique: true })
  code_reset: string;

  @Prop({ required: true })
  is_used: boolean;

  @Prop({ default: new Date() })
  create_date: Date;
}

export const ForgetPasswordSchema =
  SchemaFactory.createForClass(ForgetPassword);
