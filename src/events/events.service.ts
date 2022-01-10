import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Roles } from 'src/users/enums';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Events, EventsDocument } from './schemas/event.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Events.name)
    private readonly eventModel: Model<EventsDocument>,

    private userService: UsersService,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Events> {
    const user = await this.userService.findOne(createEventDto.organizer_id);
    if (!user) {
      throw new HttpException('User inexistant', HttpStatus.NOT_FOUND);
    }
    if (
      user.roles?.includes(Roles.Admin) ||
      user.roles?.includes(Roles.Organizer)
    ) {
      return new this.eventModel({
        ...createEventDto,
        is_confirmed: true,
      }).save();
    } else {
      return new this.eventModel({
        ...createEventDto,
        is_confirmed: false,
      }).save();
    }
  }

  async findAll() {
    return this.eventModel.find();
  }

  async findOne(id: string): Promise<Events> {
    return this.eventModel.findOne({ _id: id });
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    if (!isValidObjectId(id)) {
      throw new HttpException('ID non valide', HttpStatus.NOT_FOUND);
    }
    return this.eventModel.updateOne({ _id: id }, { $set: updateEventDto });
  }

  remove(id: string) {
    return this.eventModel.updateOne({ _id: id }, { is_deleted: true });
  }
}
