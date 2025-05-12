import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from '@/teams/teams.service';
import { BadRequest, ExtendedRequest } from '@/app/types/common.type';
import { WRONG_BODY, WRONG_PARAMS } from '@/app/constants/error.constant';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTeamBody, InviteUserBody } from '@/teams/dto/swagger.dto';
import { TeamDto } from '@/teams/dto/team.dto';
import { JwtAuthGuard } from '@/auth/guards/auth.guard';

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
    operationId: 'getTeamsByUserId',
    summary: 'Get teams by user id',
  })
  @ApiResponse({ status: 200, type: TeamDto, isArray: true })
  @ApiResponse({ status: 400, type: BadRequest })
  async getTeams(@Req() request: ExtendedRequest) {
    const { user } = request;

    if (!user?.id && Number.isNaN(Number(user.id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.teamService.getTeamsByUserId(Number(user.id));
  }

  @Get('/:id')
  @ApiOperation({ operationId: 'getTeamById', summary: 'Get team by id' })
  @ApiResponse({ status: 200, type: TeamDto })
  @ApiResponse({ status: 400, type: BadRequest })
  async getTeam(@Req() request: ExtendedRequest) {
    const { params } = request;

    if (!params?.id && Number.isNaN(Number(params.id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.teamService.getTeamById(Number(params.id));
  }

  @Post('/invite')
  @ApiOperation({ operationId: 'inviteUser', summary: 'Invite user to team' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: InviteUserBody })
  async inviteUser(
    @Req()
    request: Omit<ExtendedRequest, 'body'> & {
      body: InviteUserBody;
    },
  ) {
    const { body } = request;

    if (!body.user_invite_id || !body.team_id) {
      throw new BadRequestException(WRONG_BODY);
    }

    return this.teamService.inviteUser(body.user_invite_id, body.team_id);
  }

  @Post('/accept')
  @ApiExcludeEndpoint()
  async acceptInvite(@Req() request: ExtendedRequest) {
    const { query } = request;

    if (!query?.token) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    await this.teamService.acceptInvite(query.token as string);
  }

  @Post('/reject')
  @ApiExcludeEndpoint()
  async rejectInvite(@Req() request: ExtendedRequest) {
    const { query } = request;

    if (!query?.token) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    await this.teamService.rejectInvite(query.token as string);
  }
}
