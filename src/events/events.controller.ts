import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { Roles } from 'src/users/enums';
import { HasRole } from 'src/decorators/has-role.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @HasRole(Roles.Organizer)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @HttpCode(HttpStatus.OK)
  @HasRole(Roles.Organizer)
  @Patch('/endAnEvent/:id')
  endAnEvent(@Param('id') id: string) {
    return this.eventsService.endAnEvent(id);
  }

  @HttpCode(HttpStatus.OK)
  @HasRole(Roles.Organizer)
  @Patch('/cancelAnEvent/:id')
  cancelAnEvent(@Param('id') id: string) {
    return this.eventsService.cancelAnEvent(id);
  }

  @HttpCode(HttpStatus.OK)
  @HasRole(Roles.Organizer)
  @Patch('/changePropositionToEvent/:id')
  changePropositionToEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.changePropositionToEvent(id, updateEventDto);
  }

  @HttpCode(HttpStatus.OK)
  @HasRole(Roles.Organizer)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/addParticipant/:eventId')
  addParticipant(
    @Param('eventId') event_id: string,
    @Body() CreateParticipantDto: CreateParticipantDto,
  ) {
    return this.eventsService.addParticipant(event_id, CreateParticipantDto);
  }

  @HttpCode(HttpStatus.OK)
  @HasRole(Roles.Organizer)
  @Delete('/deleteParticipant/:eventId')
  removeParticipant(
    @Param('eventId') event_id: string,
    @Body() updateParticipantDto: UpdateParticipantDto,
  ) {
    return this.eventsService.removeParticipant(event_id, updateParticipantDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/addComment/:eventId')
  addComment(
    @Param('eventId') event_id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.eventsService.addComment(event_id, createCommentDto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/updateComment/eventId/:eventId/commentId/:commentId')
  updateComment(
    @Param('eventId') event_id: string,
    @Param('commentId') comment_id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.eventsService.updateComment(
      event_id,
      comment_id,
      updateCommentDto,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/deleteComment/eventId/:eventId/commentId/:commentId')
  deleteComment(
    @Param('eventId') event_id: string,
    @Param('commentId') comment_id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.eventsService.deleteComment(
      event_id,
      comment_id,
      updateCommentDto,
    );
  }
}
