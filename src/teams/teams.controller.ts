import { Controller } from '@nestjs/common';
import { TeamsService } from '@/teams/teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamService: TeamsService) {}

  async createTeam() {}
}
