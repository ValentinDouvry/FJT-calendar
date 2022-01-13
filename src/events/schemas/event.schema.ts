import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
export type EventsDocument = Events & Document;

@Schema()
export class Participants {
  @Prop({ required: true })
  user_id: string;

  @Prop({ default: Date.now })
  date: Date;

  @Prop({ default: false })
  has_participated: boolean;
  participant: () => number;
}

@Schema()
export class Comments {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  comment: string;

  @Prop({ default: Date.now })
  created_date: Date;

  @Prop({ default: Date.now })
  update_date: Date;

  @Prop()
  deleted_date: Date;

  @Prop()
  is_deleted: boolean;
}

@Schema()
export class Events {
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

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop()
  is_confirmed: boolean;

  @Prop({ required: true })
  start_date: Date;

  @Prop({ required: true })
  end_date: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  organizer_id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  proposed_by: string;

  @Prop({ Participants })
  participants: Participants[];

  @Prop({ Comments })
  comments: Comments[];
}

export const EventsSchema = SchemaFactory.createForClass(Events);
