import {
  BadRequestException,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from '@/projects/projects.service';
import { BadRequest, ExtendedRequest } from '@/app/types/common.type';
import {
  CreateProjectBody,
  CreateProjectTaskBody,
  ShortInfoProjectDto,
  UpdateProjectBody,
  UpdateProjectTaskBody,
} from '@/projects/dto/swagger.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectDto, ProjectTaskDto } from '@/projects/dto/projects.dto';
import { WRONG_PARAMS } from '@/app/constants/error.constant';
import { TeamIncludeGuard } from '@/teams/guards/teams.guard';
import { JwtAuthGuard } from '@/auth/guards/auth.guard';
import { ProjectIncludeGuard } from '@/projects/guards/projects.guard';

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

  @UseGuards(ProjectIncludeGuard)
  @Post('/:project_id/tasks')
  @ApiOperation({
    summary: 'Create project task',
    operationId: 'createProjectTask',
  })
  @ApiResponse({ status: 200, type: ProjectTaskDto })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: CreateProjectTaskBody })
  @ApiParam({ name: 'project_id', type: Number, required: true })
  async createProjectTask(
    @Req()
    request: Omit<ExtendedRequest, 'body'> & { body: CreateProjectTaskBody },
  ) {
    const { user, body, params } = request;

    if (!params?.project_id || Number.isNaN(Number(params?.project_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.projectService.createProjectTask(
      user.id,
      Number(params.project_id),
      body,
    );
  }

  @UseGuards(ProjectIncludeGuard)
  @Patch('/:project_id')
  @ApiOperation({ summary: 'Update project', operationId: 'updateProject' })
  @ApiResponse({ status: 200, type: ProjectDto })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: UpdateProjectBody })
  @ApiParam({ name: 'project_id', type: Number, required: true })
  async updateProject(
    @Req()
    request: Omit<ExtendedRequest, 'body'> & { body: UpdateProjectBody },
  ) {
    const { user, body, params } = request;

    if (!params?.project_id || Number.isNaN(Number(params?.project_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.projectService.updateProject(
      user.id,
      Number(params.project_id),
      body,
    );
  }

  @UseGuards(ProjectIncludeGuard)
  @Patch('/:project_id/tasks/:task_id')
  @ApiOperation({
    summary: 'Update project task',
    operationId: 'updateProjectTask',
  })
  @ApiResponse({ status: 200, type: ProjectTaskDto })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: UpdateProjectTaskBody })
  @ApiParam({ name: 'project_id', type: Number, required: true })
  @ApiParam({ name: 'task_id', type: Number, required: true })
  async updateProjectTask(
    @Req()
    request: Omit<ExtendedRequest, 'body'> & { body: UpdateProjectTaskBody },
  ) {
    const { user, body, params } = request;

    if (!params?.project_id || Number.isNaN(Number(params?.project_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    if (!params?.task_id || Number.isNaN(Number(params?.task_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.projectService.updateProjectTask(
      user.id,
      Number(params.project_id),
      Number(params.task_id),
      body,
    );
  }

  @UseGuards(TeamIncludeGuard)
  @Get('/')
  @ApiOperation({ summary: 'Get projects', operationId: 'getProjects' })
  @ApiResponse({ status: 200, type: ShortInfoProjectDto, isArray: true })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiQuery({ name: 'team_id', type: String, required: true })
  async getProjects(@Req() request: ExtendedRequest) {
    const { query, user } = request;

    if (query?.team_id && Number.isNaN(Number(query?.team_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.projectService.getProjects(Number(query.team_id), user.id);
  }

  @UseGuards(ProjectIncludeGuard)
  @Get('/:project_id')
  @ApiOperation({ summary: 'Get project', operationId: 'getProject' })
  @ApiResponse({ status: 200, type: ProjectDto })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiParam({ name: 'project_id', type: String, required: true })
  async getProject(@Req() request: ExtendedRequest) {
    const { params, user } = request;

    if (params?.project_id && Number.isNaN(Number(params?.project_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.projectService.getProject(Number(params.project_id), user.id);
  }
}
