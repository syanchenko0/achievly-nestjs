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
import { TeamsService } from '@/teams/teams.service';
import { BadRequest, ExtendedRequest } from '@/app/types/common.type';
import { WRONG_BODY, WRONG_PARAMS } from '@/app/constants/error.constant';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateTeamBody,
  DeleteTeamMembersBody,
  UpdateTeamMemberBody,
} from '@/teams/dto/swagger.dto';
import { TeamDto, TeamGeneralInfoDto } from '@/teams/dto/team.dto';
import { JwtAuthGuard } from '@/auth/guards/auth.guard';
import { TeamIncludeGuard } from '@/teams/guards/teams.guard';
import { deleteTeamMembersSchema } from '@/teams/schemas/teams.schema';

@ApiTags('Teams')
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamService: TeamsService) {}

  @Post('/')
  @ApiOperation({ operationId: 'createTeam', summary: 'Create team' })
  @ApiResponse({ status: 200, type: TeamDto })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: CreateTeamBody })
  async createTeam(
    @Req() request: Omit<ExtendedRequest, 'body'> & { body: CreateTeamBody },
  ) {
    const { user, body } = request;

    return this.teamService.createTeam(user, body);
  }

  @Get('/')
  @ApiOperation({
    operationId: 'getTeams',
    summary: 'Get teams by user id',
  })
  @ApiResponse({ status: 200, type: TeamDto, isArray: true })
  @ApiResponse({ status: 400, type: BadRequest })
  async getTeams(@Req() request: ExtendedRequest) {
    const { user } = request;

    if (!user?.id || Number.isNaN(Number(user.id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.teamService.getTeamsByUserId(Number(user.id));
  }

  @UseGuards(TeamIncludeGuard)
  @Get('/:team_id')
  @ApiOperation({
    operationId: 'getTeam',
    summary: 'Get team by id',
  })
  @ApiResponse({ status: 200, type: TeamDto })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiParam({ name: 'team_id', type: 'string' })
  async getTeam(@Req() request: ExtendedRequest) {
    const { params, user } = request;

    if (!params?.team_id || Number.isNaN(Number(params.team_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return await this.teamService.getTeamById(Number(params.team_id), user.id);
  }

  @Get('/:team_id/info')
  @ApiOperation({
    operationId: 'getTeamGeneralInfo',
    summary: 'Get team general info',
  })
  @ApiResponse({ status: 200, type: TeamGeneralInfoDto })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiParam({ name: 'team_id', type: 'string' })
  async getTeamGeneralInfo(@Req() request: ExtendedRequest) {
    const { params } = request;

    if (!params?.team_id || Number.isNaN(Number(params.team_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.teamService.getTeamGeneralInfo(Number(params.team_id));
  }

  @Get('/:team_id/join-link')
  @ApiOperation({
    operationId: 'getTeamJoinLink',
    summary: 'Get team join link',
  })
  @ApiResponse({ status: 200, type: String })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiParam({ name: 'team_id', type: 'string' })
  async getTeamJoinLink(@Req() request: ExtendedRequest) {
    const { params } = request;

    if (!params?.team_id || Number.isNaN(Number(params.team_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.teamService.getJoinLink(Number(params.team_id));
  }

  @Patch(':team_id/members/:member_id')
  @ApiOperation({
    operationId: 'updateTeamMember',
    summary: 'Update team member',
  })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiParam({ name: 'team_id', type: 'string' })
  @ApiParam({ name: 'member_id', type: 'string' })
  @ApiBody({ type: UpdateTeamMemberBody })
  async updateTeamMember(
    @Req()
    request: Omit<ExtendedRequest, 'body'> & { body: UpdateTeamMemberBody },
  ) {
    const { user, params, body } = request;

    if (
      !params?.team_id ||
      Number.isNaN(Number(params.team_id)) ||
      !params?.member_id ||
      Number.isNaN(Number(params.member_id))
    ) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.teamService.updateTeamMember(
      Number(user.id),
      Number(params.team_id),
      Number(params.member_id),
      body,
    );
  }

  @Post('/:id/join')
  @ApiOperation({ operationId: 'joinTeam', summary: 'Join to team' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'jat', type: 'string' })
  async joinToTeam(
    @Req()
    request: ExtendedRequest,
  ) {
    const { user, params, query } = request;

    if (!params?.id || Number.isNaN(Number(params.id)) || !query?.jat) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.teamService.joinToTeam(
      Number(user.id),
      Number(params.id),
      query.jat as string,
    );
  }

  @Post('/:team_id/leave')
  @ApiOperation({
    operationId: 'leaveFromTeam',
    summary: 'Leave from team',
  })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiParam({ name: 'team_id', type: 'string' })
  async leaveFromTeam(@Req() request: ExtendedRequest) {
    const { user, params } = request;

    if (!params?.team_id || Number.isNaN(Number(params.team_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.teamService.leaveFromTeam(
      Number(params.team_id),
      Number(user.id),
    );
  }

  @Delete('/:team_id')
  @ApiOperation({ operationId: 'deleteTeam', summary: 'Delete team' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiParam({ name: 'team_id', type: 'string' })
  async deleteTeam(@Req() request: ExtendedRequest) {
    const { user, params } = request;

    if (!params?.team_id || Number.isNaN(Number(params.team_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.teamService.deleteTeam(Number(params.team_id), Number(user.id));
  }

  @Delete('/:team_id/members')
  @ApiOperation({
    operationId: 'deleteTeamMembers',
    summary: 'Delete team members',
  })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: DeleteTeamMembersBody })
  @ApiParam({ name: 'team_id', type: 'string' })
  async deleteTeamMembers(
    @Req()
    request: Omit<ExtendedRequest, 'body'> & { body: DeleteTeamMembersBody },
  ) {
    const { user, params, body } = request;

    if (!params?.team_id || Number.isNaN(Number(params.team_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    const { error } = deleteTeamMembersSchema.safeParse(body);

    if (error) {
      throw new BadRequestException(WRONG_BODY);
    }

    for (const id of body.member_ids) {
      await this.teamService.deleteMember(Number(params.team_id), id, user.id);
    }
  }

  @Delete('/:team_id/members/:member_id')
  @ApiOperation({
    operationId: 'deleteTeamMember',
    summary: 'Delete team member',
  })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiParam({ name: 'team_id', type: 'string' })
  @ApiParam({ name: 'member_id', type: 'string' })
  async deleteTeamMember(@Req() request: ExtendedRequest) {
    const { user, params } = request;

    if (
      !params?.team_id ||
      Number.isNaN(Number(params.team_id)) ||
      !params?.member_id ||
      Number.isNaN(Number(params.member_id))
    ) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.teamService.deleteMember(
      Number(params.team_id),
      Number(params.member_id),
      user.id,
    );
  }
}
