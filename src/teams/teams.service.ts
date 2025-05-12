import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from '@/teams/entities/team.entity';
import { RequestUser } from '@/app/types/common.type';
import { createTeamSchema } from '@/teams/schemas/team.schema';
import { UsersService } from '@/users/users.service';
import {
  INVITATION_TEAM_NOT_FOUND,
  TEAM_NOT_FOUND,
  USER_NOT_FOUND,
  WRONG_BODY,
} from '@/app/constants/error.constant';
import { TeamDto } from '@/teams/dto/team.dto';
import { InvitationTeamEntity } from '@/teams/entities/invitation.entity';
import { NotificationsService } from '@/notifications/notifications.service';
import { CreateTeamBody } from '@/teams/dto/swagger.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    @InjectRepository(InvitationTeamEntity)
    private readonly invitationTeamRepository: Repository<InvitationTeamEntity>,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createTeam({ id }: RequestUser, body: CreateTeamBody) {
    const user = await this.usersService.getUserById(id);

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const { error } = createTeamSchema.safeParse(body);

    if (error) {
      throw new BadRequestException(WRONG_BODY);
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

  async getTeamsByUserId(id: number) {
    const teams = await this.teamRepository.find({
      where: {
        users: {
          id,
        },
      },
      relations: ['users'],
    });

    return (teams || []).map((team) => new TeamDto(team));
  }

  async inviteUser(user_invite_id: string, team_id: number) {
    const user = await this.usersService.getUserByInviteId(user_invite_id);

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const team = await this.teamRepository.findOneBy({ id: team_id });

    if (!team) {
      throw new NotFoundException(TEAM_NOT_FOUND);
    }

    const invitationTeam = await this.invitationTeamRepository.save({
      user,
      team,
    });

    await this.notificationsService.createNotification({
      title: 'Вы были приглашены в команду',
      description: 'Перейдите по ссылке, чтобы принять приглашение',
      accept: `/teams/accept?token=${invitationTeam.accept_token}`,
      reject: `/teams/reject?token=${invitationTeam.reject_token}`,
    });
  }

  async acceptInvite(accept_token: string) {
    const invitation = await this.invitationTeamRepository.findOne({
      where: { accept_token },
      relations: ['user', 'team'],
    });

    if (!invitation) {
      throw new NotFoundException(INVITATION_TEAM_NOT_FOUND);
    }

    const { user, team } = invitation;

    await this.teamRepository.update(team.id, {
      users: [...(team?.users || []), user],
    });

    await this.invitationTeamRepository.delete({ id: invitation.id });
  }

  async rejectInvite(reject_token: string) {
    const invitation = await this.invitationTeamRepository.findOne({
      where: { reject_token },
    });

    if (!invitation) {
      throw new NotFoundException(INVITATION_TEAM_NOT_FOUND);
    }

    await this.invitationTeamRepository.delete({ id: invitation.id });
  }
}
