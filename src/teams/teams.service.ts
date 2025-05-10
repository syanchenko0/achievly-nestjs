import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from '@/teams/entities/team.entity';
import { RequestUser } from '@/app/types/common.type';
import { CreateTeamBody } from '@/teams/schemas/team.schema';
import { UsersService } from '@/users/users.service';
import { TEAM_NOT_FOUND, USER_NOT_FOUND } from '@/app/constants/error.constant';
import { TeamDto } from '@/teams/dto/team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    private readonly usersService: UsersService,
  ) {}

  async createTeam({ id }: RequestUser, body: CreateTeamBody) {
    const user = await this.usersService.getUserById(id);

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const team = await this.teamRepository.save({
      name: body.name,
      created_by: user,
      users: [user],
    });

    return new TeamDto(team);
  }

  async getTeamById(id: number) {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!team) {
      throw new NotFoundException(TEAM_NOT_FOUND);
    }

    return new TeamDto(team);
  }
}
