import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BadRequest, ExtendedRequest } from '@/app/types/common.type';
import { CreateEventsBody, UpdateEventBody } from '@/events/dto/swagger.dto';
import { EventDto } from '@/events/dto/event.dto';
import { EventsService } from '@/events/events.service';
import { UpdateResult } from 'typeorm';
import { JwtAuthGuard } from '@/auth/guards/auth.guard';
import { WRONG_PARAMS } from '@/app/constants/error.constant';

@ApiTags('Events')
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('/')
  @ApiOperation({ operationId: 'createEvents', summary: 'Create events' })
  @ApiResponse({ status: 200, type: EventDto, isArray: true })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: CreateEventsBody })
  async createEvents(
    @Req() request: Omit<ExtendedRequest, 'body'> & { body: CreateEventsBody },
  ) {
    const { user, body } = request;

    return this.eventsService.createEvents(user.id, body?.events);
  }

  @Get('/')
  @ApiOperation({ operationId: 'getEvents', summary: 'Get events' })
  @ApiResponse({ status: 200, type: EventDto, isArray: true })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiQuery({ name: 'start_period', type: String, required: true })
  @ApiQuery({ name: 'end_period', type: String, required: true })
  async getEvents(@Req() request: ExtendedRequest) {
    const { user, query } = request;

    return this.eventsService.getEvents(
      user,
      query?.start_period as string,
      query?.end_period as string,
    );
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

    return this.eventsService.updateEvent(Number(params.id), body);
  }

  @Delete('/:event_id')
  @ApiOperation({ operationId: 'deleteEvent', summary: 'Delete event' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiParam({ name: 'event_id', type: String, required: true })
  async deleteEvent(@Req() request: ExtendedRequest) {
    const { params } = request;

    if (params?.event_id && Number.isNaN(Number(params.event_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.eventsService.deleteEvent(Number(params.event_id));
  }
}
