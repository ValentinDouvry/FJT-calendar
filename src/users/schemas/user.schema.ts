import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

enum Role {
  Admin = 'Admin',
  User = 'User',
  Organizer = 'Organizer',
}

enum Status {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Refused = 'Refused',
}

@Schema()
export class User {
  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true, unique: true })
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

  @Prop({ enum: Role, default: Role.User })
  roles: string;

  @Prop()
  avatar_path: string;

  @Prop({ default: Role.User })
  status: Status;
}

export const UserSchema = SchemaFactory.createForClass(User);