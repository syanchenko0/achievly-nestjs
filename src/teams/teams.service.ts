import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from '@/teams/entities/team.entity';
import { RequestUser } from '@/app/types/common.type';
import {
  createTeamSchema,
  updateTeamMemberSchema,
} from '@/teams/schemas/teams.schema';
import { UsersService } from '@/users/users.service';
import {
  MEMBER_DELETE_FORBIDDEN,
  MEMBER_NOT_FOUND,
  MEMBER_UPDATE_FORBIDDEN,
  TEAM_ALREADY_JOINED,
  TEAM_DELETE_FORBIDDEN,
  TEAM_NOT_FOUND,
  TEAM_NOT_JOINED,
  USER_NOT_FOUND,
  WRONG_BODY,
  WRONG_PARAMS,
} from '@/app/constants/error.constant';
import { TeamDto, TeamGeneralInfoDto } from '@/teams/dto/team.dto';
import { CreateTeamBody, UpdateTeamMemberBody } from '@/teams/dto/swagger.dto';
import { MemberRoles } from '@/teams/types/teams.type';
import { MemberEntity } from '@/teams/entities/member.entity';
import {
  findAdmin,
  findOwner,
  updateMemberProjectsRights,
} from '@/teams/teams.helper';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    private readonly usersService: UsersService,
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
      members: [],
      users: [user],
    });

    const member = await this.memberRepository.save({
      user,
      team,
      role: MemberRoles.owner,
    });

    team.members.push(member);

    await this.teamRepository.save(team);

    return new TeamDto(team, user.id);
  }

  async getTeamGeneralInfo(team_id: number) {
    const team = await this.teamRepository.findOne({
      where: { id: team_id },
      relations: ['members'],
    });

    if (!team) {
      throw new NotFoundException(TEAM_NOT_FOUND);
    }

    return new TeamGeneralInfoDto(team);
  }

  async getTeamById(team_id: number) {
    return await this.teamRepository.findOne({
      where: { id: team_id },
      relations: ['members', 'members.team', 'users'],
    });
  }

  async getTeamsByUserId(user_id: number) {
    const teams = await this.teamRepository.find({
      where: {
        users: {
          id: user_id,
        },
      },
      relations: ['members', 'members.team'],
    });

    return (teams || [])
      .sort((a, b) => a.id - b.id)
      .map((team) => new TeamDto(team, user_id));
  }

  async updateTeamMember(
    user_id: number,
    team_id: number,
    member_id: number,
    body: UpdateTeamMemberBody,
  ) {
    const team = await this.teamRepository.findOne({
      where: { id: team_id },
      relations: ['members'],
    });

    if (!team) {
      throw new NotFoundException(TEAM_NOT_FOUND);
    }

    const member = await this.memberRepository.findOneBy({ id: member_id });

    if (!member) {
      throw new NotFoundException(MEMBER_NOT_FOUND);
    }

    const user = await this.usersService.getUserById(user_id);

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const { error } = updateTeamMemberSchema.safeParse(body);

    if (error) {
      throw new BadRequestException(WRONG_BODY);
    }

    const isOwner = findOwner(team.members, user.id);

    const isAdmin = findAdmin(team.members, user.id);

    if (isOwner || (isAdmin && member.role === MemberRoles.member)) {
      member.projects_rights = updateMemberProjectsRights(
        member,
        body.projects_rights,
      );

      await this.memberRepository.save(member);

      if (isOwner) {
        member.role = body.role as MemberRoles;

        await this.memberRepository.save(member);
      }

      team.members = team.members.map((m) => {
        if (m.id === member_id) {
          return member;
        }

        return m;
      });

      return new TeamDto(team, user.id);
    }

    throw new ForbiddenException(MEMBER_UPDATE_FORBIDDEN);
  }

  async addProjectsRights(
    team_id: number,
    project_id: number,
    project_name: string,
  ) {
    const team = await this.teamRepository.findOne({
      where: { id: team_id },
      relations: ['members'],
    });

    if (!team) {
      throw new NotFoundException(TEAM_NOT_FOUND);
    }

    team.members = team.members.map((member) => {
      const isOwner = member.role === MemberRoles.owner;

      return {
        ...member,
        projects_rights: [
          ...(member.projects_rights || []),
          {
            project_id,
            project_name,
            create: isOwner,
            read: isOwner,
            update: isOwner,
            delete: isOwner,
          },
        ],
      };
    });

    await this.memberRepository.save(team.members);
  }

  async getJoinLink(team_id: number) {
    const team = await this.teamRepository.findOneBy({ id: team_id });

    if (!team) {
      throw new NotFoundException(TEAM_NOT_FOUND);
    }

    return `/teams/${team.id}/join?jat=${team.join_access_token}`;
  }

  async joinToTeam(
    user_id: number,
    team_id: number,
    join_access_token: string,
  ) {
    const team = await this.teamRepository.findOne({
      where: { id: team_id },
      relations: ['users', 'members', 'projects'],
    });

    const user = await this.usersService.getUserById(user_id);

    if (!team) {
      throw new NotFoundException(TEAM_NOT_FOUND);
    }

    if (team.join_access_token !== join_access_token) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    if (team.users.some((u) => u.id === user.id)) {
      throw new BadRequestException(TEAM_ALREADY_JOINED);
    }

    team.users.push(user);

    const member = await this.memberRepository.save({
      user,
      team,
      role: MemberRoles.member,
      projects_rights: team.projects?.map((project) => ({
        project_id: project.id,
        project_name: project.name,
        create: false,
        read: false,
        update: false,
        delete: false,
      })),
    });

    team.members.push(member);

    await this.teamRepository.save(team);
  }

  async leaveFromTeam(team_id: number, user_id: number) {
    const team = await this.teamRepository.findOne({
      where: { id: team_id },
      relations: ['users', 'members'],
    });

    if (!team) {
      throw new NotFoundException(TEAM_NOT_FOUND);
    }

    const user = await this.usersService.getUserById(user_id);

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    if (!team.users.some((u) => u.id === user.id)) {
      throw new BadRequestException(TEAM_NOT_JOINED);
    }

    team.members = team.members.filter((m) => m.user.id !== user.id);
    team.users = team.users.filter((u) => u.id !== user.id);

    await this.teamRepository.save(team);

    await this.memberRepository.delete({
      team: { id: team_id },
      user: { id: user_id },
    });
  }

  async deleteTeam(team_id: number, user_id: number) {
    const team = await this.teamRepository.findOne({
      where: { id: team_id },
      relations: ['members'],
    });

    if (!team) {
      throw new NotFoundException(TEAM_NOT_FOUND);
    }

    const isOwner = findOwner(team.members, user_id);

    if (!isOwner) {
      throw new ForbiddenException(TEAM_DELETE_FORBIDDEN);
    }

    return await this.teamRepository.delete({ id: team_id });
  }

  async deleteMember(team_id: number, member_id: number, user_id: number) {
    const team = await this.teamRepository.findOne({
      where: { id: team_id },
      relations: ['members', 'users'],
    });

    if (!team) {
      throw new NotFoundException(TEAM_NOT_FOUND);
    }

    const member = await this.memberRepository.findOneBy({ id: member_id });

    if (!member) {
      throw new NotFoundException(MEMBER_NOT_FOUND);
    }

    if (user_id === member.user.id) {
      throw new BadRequestException(MEMBER_DELETE_FORBIDDEN);
    }

    const isOwner = findOwner(team.members, user_id);

    const isAdmin = findAdmin(team.members, user_id);

    if (!isOwner && !(isAdmin && member.role === MemberRoles.member)) {
      throw new ForbiddenException(MEMBER_DELETE_FORBIDDEN);
    }

    team.members = team.members.filter((m) => m.id !== member_id);
    team.users = team.users.filter((u) => u.id !== member.user.id);

    await this.teamRepository.save(team);

    return await this.memberRepository.delete({ id: member_id });
  }
}
