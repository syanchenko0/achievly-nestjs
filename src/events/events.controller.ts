import { Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BadRequest } from '@/app/types/common.type';

@Controller('events')
export class EventsController {
  @Post('/')
  @ApiOperation({ operationId: 'createEvent', summary: 'Create event' })
  @ApiResponse({ status: 200, type: EventDto })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: CreateEventDto })
  async createEvent() {}
}
