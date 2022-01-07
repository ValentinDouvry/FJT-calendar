import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Roles } from '../enums/roles.enum';
import { Status } from '../enums/status.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  room_number: string;

  @Prop({ default: Date.now })
  created_date: Date;

  @Prop({ default: Date.now })
  update_date: Date;

  @Prop()
  deleted_date: Date;

  @Prop()
  is_deleted: boolean;

  @Prop({ type: [{ type: String, enum: Roles }], default: [Roles.User] })
  roles: [string];

  @Prop()
  avatar_path: string;

  @Prop({ enum: Status, default: Status.Pending })
  status: Status;
}

export const UserSchema = SchemaFactory.createForClass(User);
