import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, mongo, Mongoose } from 'mongoose';
import { use } from 'passport';
import { parse } from 'path/posix';
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
import { Status } from './enums/status.enum';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Events.name)
    private readonly eventModel: Model<EventsDocument>,

    private userService: UsersService,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Events> {
    let user;
    if (
      createEventDto.organizer_id == undefined &&
      createEventDto.proposed_by == undefined
    ) {
      throw new HttpException(
        'User et Organizer non renseigné',
        HttpStatus.NOT_FOUND,
      );
    } else {
      if (createEventDto.organizer_id != undefined) {
        console.log(createEventDto.organizer_id);
        user = await this.userService.findOne(createEventDto.organizer_id);
        if (!user) {
          throw new HttpException('User inexistant', HttpStatus.NOT_FOUND);
        }
        return new this.eventModel({
          ...createEventDto,
          is_confirmed: true,
        }).save();
      } else {
        user = await this.userService.findOne(createEventDto.proposed_by);
        if (!user) {
          throw new HttpException('User inexistant', HttpStatus.NOT_FOUND);
        }
        return new this.eventModel({
          ...createEventDto,
          is_confirmed: false,
        }).save();
      }
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
    const event = await this.eventModel.findOne({ _id: id });
    if (!event) {
      throw new HttpException('evenement inexistant', HttpStatus.NOT_FOUND);
    }
    return this.eventModel.updateOne({ _id: id }, { $set: updateEventDto });
  }

  async endAnEvent(id: string) {
    if (!isValidObjectId(id)) {
      throw new HttpException('ID non valide', HttpStatus.NOT_FOUND);
    }
    const event = await this.eventModel.findOne({ _id: id });
    if (!event) {
      throw new HttpException('evenement inexistant', HttpStatus.NOT_FOUND);
    }
    return this.eventModel.updateOne({ _id: id }, { status: Status.Finished });
  }

  async cancelAnEvent(id: string) {
    if (!isValidObjectId(id)) {
      throw new HttpException('ID non valide', HttpStatus.NOT_FOUND);
    }
    const event = await this.eventModel.findOne({ _id: id });
    if (!event) {
      throw new HttpException('evenement inexistant', HttpStatus.NOT_FOUND);
    }
    return this.eventModel.updateOne({ _id: id }, { status: Status.Canceled });
  }

  async changePropositionToEvent(id: string, updateEventDto: UpdateEventDto) {
    if (!isValidObjectId(id)) {
      throw new HttpException('ID non valide', HttpStatus.NOT_FOUND);
    }
    const event = await this.eventModel.findOne({ _id: id });
    if (!event) {
      throw new HttpException('evenement inexistant', HttpStatus.NOT_FOUND);
    }
    if (event.is_confirmed == true) {
      throw new HttpException(
        'La proposition que vous souhaitez chanegr en évènement est déja un évènement',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.eventModel.updateOne(
      { _id: id },
      { ...updateEventDto, is_confirmed: true },
    );
  }

  async remove(id: string) {
    const event = await this.eventModel.findOne({ _id: id });
    if (!event) {
      throw new HttpException('evenement inexistant', HttpStatus.NOT_FOUND);
    }
    return this.eventModel.updateOne(
      { _id: event._id },
      { is_deleted: true, deleted_date: new Date() },
    );
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
