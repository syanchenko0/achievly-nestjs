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

  async createEvent({ id: userId }: RequestUser, body: CreateEventBody) {
    const { data, error } = CreateEventSchema.safeParse(body);

    if (error || !data) throw new BadRequestException(WRONG_BODY);

    const user = await this.usersService.getUserById(userId);

    if (!user) throw new BadRequestException(WRONG_TOKEN);

    const event = await this.eventRepository.save({
      title: data.title,
      start_timestamp: data.start_timestamp,
      end_timestamp: data.end_timestamp,
      user,
    });

    return new EventDto(event);
  }

  async getEvents(user: RequestUser) {
    const events = await this.eventRepository.find({
      where: { user: { id: user.id } },
    });

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
