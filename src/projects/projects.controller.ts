import { BadRequestException, Controller, Post, Req } from '@nestjs/common';
import { ProjectsService } from '@/projects/projects.service';
import { BadRequest, ExtendedRequest } from '@/app/types/common.type';
import { CreateProjectBody } from '@/projects/dto/swagger.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ProjectDto } from '@/projects/dto/projects.dto';
import { WRONG_PARAMS } from '@/app/constants/error.constant';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Post('/')
  @ApiOperation({ summary: 'Create project', operationId: 'createProject' })
  @ApiResponse({ status: 200, type: ProjectDto })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: CreateProjectBody })
  @ApiParam({ name: 'team_id', type: Number })
  async createProject(
    @Req() request: Omit<ExtendedRequest, 'body'> & { body: CreateProjectBody },
  ) {
    const { user, body, params } = request;

    if (!params?.team_id || Number.isNaN(Number(params?.team_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.projectService.createProject(
      user.id,
      Number(params.team_id),
      body,
    );
  }
}
