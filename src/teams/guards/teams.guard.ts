import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TeamsService } from '@/teams/teams.service';
import {
  TEAM_FORBIDDEN,
  WRONG_PARAMS,
  WRONG_TOKEN,
} from '@/app/constants/error.constant';
import { ExtendedRequest } from '@/app/types/common.type';

@Injectable()
class TeamIncludeGuard implements CanActivate {
  constructor(private teamsService: TeamsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: ExtendedRequest = context.switchToHttp().getRequest();

    const { params } = request;

    if (!request.user) {
      throw new UnauthorizedException(WRONG_TOKEN);
    }

    const requestTeamId = params?.team_id;

    if (!requestTeamId && Number.isNaN(Number(requestTeamId))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    const teams = await this.teamsService.getTeamsByUserId(request.user.id);

    const teamIds = teams?.map((team) => team.id);

    if (!teamIds?.includes(Number(requestTeamId))) {
      throw new ForbiddenException(TEAM_FORBIDDEN);
    }

    return true;
  }
}

export { TeamIncludeGuard };
