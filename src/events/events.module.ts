import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Events, EventsSchema } from './schemas/event.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Events.name, schema: EventsSchema }]),
  ],
  controllers: [EventsController],
  providers: [EventsService, UsersService],
})
export class EventsModule {}
