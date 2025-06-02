import { BadRequestException, Injectable } from '@nestjs/common';
import { WRONG_BODY, WRONG_TOKEN } from '@/app/constants/error.constant';
import { RequestUser } from '@/app/types/common.type';
import { CreateEventBody, UpdateEventBody } from '@/events/dto/swagger.dto';
import { UsersService } from '@/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from '@/events/entities/event.entity';
import {
  CreateEventSchema,
  CreateEventsSchema,
  UpdateEventSchema,
} from '@/events/schemas/event.schema';
import { EventDto } from '@/events/dto/event.dto';

@Injectable()
export class EventsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  async createEvent(user_id: number, body: CreateEventBody) {
    const { error } = CreateEventSchema.safeParse(body);

    if (error) throw new BadRequestException(WRONG_BODY);

    const user = await this.usersService.getUserById(user_id);

    if (!user) throw new BadRequestException(WRONG_TOKEN);

    const event = await this.eventRepository.save({
      title: body.title,
      start_timestamp: body.start_timestamp,
      end_timestamp: body.end_timestamp,
      user,
    });

    return new EventDto(event);
  }

  async createEvents(user_id: number, body: CreateEventBody[]) {
    const { error } = CreateEventsSchema.safeParse(body);

    if (error) throw new BadRequestException(WRONG_BODY);

    const events: EventDto[] = [];

    for (const event of body) {
      const result = await this.createEvent(user_id, event);
      events.push(result);
    }

    return events;
  }

  async getEvents(
    user: RequestUser,
    start_period?: string,
    end_period?: string,
  ) {
    const events = await this.eventRepository.find({
      where: { user: { id: user.id } },
    });

    if (start_period && end_period) {
      return events
        .filter(
          (event) =>
            new Date(Number(event.start_timestamp)) >= new Date(start_period) &&
            new Date(Number(event.start_timestamp)) <= new Date(end_period),
        )
        .map((event) => new EventDto(event));
    }

    return events.map((event) => new EventDto(event));
  }

  async updateEvent(id: number, body: UpdateEventBody) {
    const { data, error } = UpdateEventSchema.safeParse(body);

    if (error) throw new BadRequestException(WRONG_BODY);

    return await this.eventRepository.update(id, {
      title: data?.title,
      start_timestamp: data?.start_timestamp,
      end_timestamp: data?.end_timestamp,
    });
  }

  async deleteEvent(id: number) {
    return await this.eventRepository.delete(id);
  }
}
