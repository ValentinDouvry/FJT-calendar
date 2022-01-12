import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, mongo, Mongoose } from 'mongoose';
import { use } from 'passport';
import { parse } from 'path/posix';
import { Roles } from 'src/users/enums';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  Comments,
  Events,
  EventsDocument,
  Participants,
} from './schemas/event.schema';
import * as _ from 'lodash';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import mongoose = require('mongoose');

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

  async update(id: string, updateEventDto: UpdateEventDto) {
    if (!isValidObjectId(id)) {
      throw new HttpException('ID non valide', HttpStatus.NOT_FOUND);
    }
    const user = await this.userService.findOne(updateEventDto.organizer_id);
    if (!user) {
      throw new HttpException('User inexistant', HttpStatus.NOT_FOUND);
    }
    return this.eventModel.updateOne({ _id: id }, { $set: updateEventDto });
  }

  remove(id: string) {
    return this.eventModel.updateOne({ _id: id }, { is_deleted: true });
  }

  async addParticipant(
    event_id: string,
    CreateParticipantDto: CreateParticipantDto,
  ) {
    const event = await this.eventModel.findOne({ _id: event_id });
    if (!event) {
      throw new HttpException('evenement inexistant', HttpStatus.NOT_FOUND);
    }
    const participant = _.find(event.participants, (participant) => {
      return participant.user_id == CreateParticipantDto.user_id;
    });
    if (participant == undefined) {
      const newParticipant = new Participants();
      newParticipant.user_id = CreateParticipantDto.user_id;
      newParticipant.has_participated = false;
      newParticipant.date = new Date();
      event.participants.push(newParticipant);
      return this.eventModel.updateOne(
        { _id: event_id },
        { participants: event.participants },
      );
    } else {
      throw new HttpException(
        'cette utilisateur participe déja à cette évenement',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeParticipant(
    event_id: string,
    updateParticipantDto: UpdateParticipantDto,
  ) {
    const event = await this.eventModel.findOne({ _id: event_id });
    if (!event) {
      throw new HttpException('evenement inexistant', HttpStatus.NOT_FOUND);
    }
    const participant = _.remove(event.participants, (participant) => {
      return participant.user_id == updateParticipantDto.user_id;
    });
    if (participant != undefined) {
      return this.eventModel.updateOne(
        { _id: event_id },
        { participants: event.participants },
      );
    } else {
      throw new HttpException(
        'cette utilisateur participe déja à cette évenement',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async addComment(event_id: string, createCommentDto: CreateCommentDto) {
    const event = await this.eventModel.findOne({ _id: event_id });
    if (!event) {
      throw new HttpException('evenement inexistant', HttpStatus.NOT_FOUND);
    }
    const dateNow = new Date();
    const newComment = new Comments();
    newComment._id = new mongoose.Types.ObjectId().toString();
    newComment.user_id = createCommentDto.user_id;
    newComment.comment = createCommentDto.comment;
    newComment.created_date = dateNow;
    newComment.update_date = dateNow;
    event.comments.push(newComment);
    return this.eventModel.updateOne(
      { _id: event_id },
      { comments: event.comments },
    );
  }

  async updateComment(
    event_id: string,
    comment_id,
    updateCommentDto: UpdateCommentDto,
  ) {
    const event = await this.eventModel.findOne({ _id: event_id });
    if (!event) {
      throw new HttpException('evenement inexistant', HttpStatus.NOT_FOUND);
    }
    for (const comment of event.comments) {
      if (comment._id == comment_id) {
        comment.comment = updateCommentDto.comment;
        comment.update_date = new Date();
      }
    }
    return this.eventModel.updateOne(
      { _id: event_id },
      { comments: event.comments },
    );
  }

  async deleteComment(
    event_id: string,
    comment_id,
    updateCommentDto: UpdateCommentDto,
  ) {
    const event = await this.eventModel.findOne({ _id: event_id });
    if (!event) {
      throw new HttpException('evenement inexistant', HttpStatus.NOT_FOUND);
    }
    for (const comment of event.comments) {
      if (comment._id == comment_id) {
        comment.is_deleted = true;
        comment.deleted_date = new Date();
      }
    }
    return this.eventModel.updateOne(
      { _id: event_id },
      { comments: event.comments },
    );
  }
}
