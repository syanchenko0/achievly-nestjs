import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from '@/projects/projects.service';
import { BadRequest, ExtendedRequest } from '@/app/types/common.type';
import { CreateProjectBody } from '@/projects/dto/swagger.dto';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectDto } from '@/projects/dto/projects.dto';
import { WRONG_PARAMS } from '@/app/constants/error.constant';
import { TeamIncludeGuard } from '@/teams/guards/teams.guard';
import { JwtAuthGuard } from '@/auth/guards/auth.guard';

@ApiTags('Projects')
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Post('/')
  @ApiOperation({ summary: 'Create project', operationId: 'createProject' })
  @ApiResponse({ status: 200, type: ProjectDto })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: CreateProjectBody })
  @ApiQuery({ name: 'team_id', type: String, required: true })
  async createProject(
    @Req() request: Omit<ExtendedRequest, 'body'> & { body: CreateProjectBody },
  ) {
    const { user, body, query } = request;

    if (!query?.team_id || Number.isNaN(Number(query?.team_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.projectService.createProject(
      user.id,
      Number(query.team_id),
      body,
    );
  }

  @UseGuards(TeamIncludeGuard)
  @Get('/')
  @ApiOperation({ summary: 'Get projects', operationId: 'getProjects' })
  @ApiResponse({ status: 200, type: ProjectDto, isArray: true })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiQuery({ name: 'team_id', type: String, required: true })
  async getProjects(@Req() request: ExtendedRequest) {
    const { query, user } = request;

    if (query?.team_id && Number.isNaN(Number(query?.team_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.projectService.getProjects(Number(query.team_id), user.id);
  }
}
