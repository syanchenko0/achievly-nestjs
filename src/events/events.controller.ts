import { Controller, Delete, Get, Patch, Post, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { BadRequest, ExtendedRequest } from '@/app/types/common.type';
import { CreateEventBody, UpdateEventBody } from '@/events/dto/swagger.dto';
import { EventDto } from '@/events/dto/event.dto';
import { EventsService } from '@/events/events.service';
import { UpdateResult } from 'typeorm';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('/')
  @ApiOperation({ operationId: 'createEvent', summary: 'Create event' })
  @ApiResponse({ status: 200, type: EventDto })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: CreateEventBody })
  async createEvent(
    @Req() request: Omit<ExtendedRequest, 'body'> & { body: CreateEventBody },
  ) {
    const { user, body } = request;

    await this.eventsService.createEvent(user, body);
  }

  @Get('/')
  @ApiOperation({ operationId: 'getEvents', summary: 'Get events' })
  @ApiResponse({ status: 200, type: EventDto, isArray: true })
  @ApiResponse({ status: 400, type: BadRequest })
  async getEvents(@Req() request: ExtendedRequest) {
    const { user } = request;

    await this.eventsService.getEvents(user);
  }

  @Patch('/:id')
  @ApiOperation({ operationId: 'updateEvent', summary: 'Update event' })
  @ApiResponse({ status: 200, type: UpdateResult })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: UpdateEventBody })
  @ApiParam({ name: 'id', type: String })
  async updateEvent(
    @Req() request: Omit<ExtendedRequest, 'body'> & { body: UpdateEventBody },
  ) {
    const { params, body } = request;

    await this.eventsService.updateEvent(Number(params.id), body);
  }

  @Delete('/:id')
  @ApiOperation({ operationId: 'deleteEvent', summary: 'Delete event' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: BadRequest })
  async deleteEvent(@Req() request: ExtendedRequest) {
    const { params } = request;

    await this.eventsService.deleteEvent(Number(params.id));
  }
}
