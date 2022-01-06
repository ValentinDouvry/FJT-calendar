import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './users/user.schema.ts';
import * as mongoose from 'mongoose';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: Date.now })
  created_date: Date;

  @Prop({ default: Date.now })
  update_date: Date;

  @Prop()
  deleted_date: Date;

  @Prop()
  is_deleted: boolean;

  @Prop()
  is_confirmed: boolean;

  @Prop({ required: true })
  start_date: Date;

  @Prop({ required: true })
  end_date: Date;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  organizerId: User;



}

export const EventSchema = SchemaFactory.createForClass(Event);