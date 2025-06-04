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
import { ProjectsService } from '@/projects/projects.service';
import { BadRequest, ExtendedRequest } from '@/app/types/common.type';
import {
  CreateProjectBody,
  CreateProjectColumnBody,
  CreateProjectTaskBody,
  ProjectColumn,
  ShortInfoProjectDto,
  UpdateProjectBody,
  UpdateProjectTaskBody,
  UpdateProjectTaskListOrderBody,
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
import { UpdateResult } from 'typeorm';
import { UpdateTaskListOrderBody } from '@/goals/dto/swagger.dto';
import { RightsDecorator } from '@/projects/decorators/rights.decorator';

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

  @RightsDecorator(['read', 'create'])
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

  @RightsDecorator(['read', 'create'])
  @Post('/:project_id/columns')
  @ApiOperation({
    summary: 'Create project column',
    operationId: 'createProjectColumn',
  })
  @ApiResponse({ status: 200, type: ProjectColumn })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: CreateProjectColumnBody })
  @ApiParam({ name: 'project_id', type: Number, required: true })
  async createProjectColumn(
    @Req()
    request: Omit<ExtendedRequest, 'body'> & { body: CreateProjectColumnBody },
  ) {
    const { body, params } = request;

    if (!params?.project_id || Number.isNaN(Number(params?.project_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.projectService.createProjectColumn(
      Number(params.project_id),
      body,
    );
  }

  @RightsDecorator(['read', 'update'])
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

  @RightsDecorator(['read', 'update'])
  @Patch('/:project_id/columns/:column_id')
  @ApiOperation({
    summary: 'Update project column',
    operationId: 'updateProjectColumn',
  })
  @ApiResponse({ status: 200, type: ProjectDto })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: ProjectColumn })
  @ApiParam({ name: 'project_id', type: Number, required: true })
  @ApiParam({ name: 'column_id', type: String, required: true })
  async updateProjectColumn(
    @Req()
    request: Omit<ExtendedRequest, 'body'> & { body: ProjectColumn },
  ) {
    const { user, body, params } = request;

    if (
      !params?.project_id ||
      Number.isNaN(Number(params?.project_id)) ||
      !params?.column_id
    ) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.projectService.updateProjectColumn(
      user.id,
      Number(params.project_id),
      params.column_id,
      body,
    );
  }

  @RightsDecorator(['read', 'update'])
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
    const { body, params } = request;

    if (!params?.project_id || Number.isNaN(Number(params?.project_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    if (!params?.task_id || Number.isNaN(Number(params?.task_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.projectService.updateProjectTask(
      Number(params.project_id),
      Number(params.task_id),
      body,
    );
  }

  @RightsDecorator(['read', 'update'])
  @Post('/:project_id/tasks/list_order')
  @ApiOperation({
    operationId: 'updateProjectTaskListOrder',
    summary: 'Update project task list order',
  })
  @ApiResponse({ status: 200, type: UpdateResult })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: UpdateProjectTaskListOrderBody, isArray: true })
  @ApiParam({ name: 'project_id', type: Number, required: true })
  async updateProjectTaskListOrder(
    @Req()
    request: Omit<ExtendedRequest, 'body'> & {
      body: UpdateTaskListOrderBody[];
    },
  ) {
    const { body } = request;

    return await this.projectService.updateProjectTaskListOrder(body);
  }

  @UseGuards(TeamIncludeGuard)
  @Get('/')
  @ApiOperation({ summary: 'Get projects', operationId: 'getProjects' })
  @ApiResponse({ status: 200, type: ShortInfoProjectDto, isArray: true })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiQuery({ name: 'team_id', type: String, required: true })
  async getProjects(@Req() request: ExtendedRequest) {
    const { query, user } = request;

    if (!query?.team_id || Number.isNaN(Number(query?.team_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.projectService.getProjects(Number(query.team_id), user.id);
  }

  @RightsDecorator(['read'])
  @Get('/:project_id')
  @ApiOperation({ summary: 'Get project', operationId: 'getProject' })
  @ApiResponse({ status: 200, type: ProjectDto })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiParam({ name: 'project_id', type: String, required: true })
  async getProject(@Req() request: ExtendedRequest) {
    const { params, user } = request;

    if (!params?.project_id || Number.isNaN(Number(params?.project_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.projectService.getProject(Number(params.project_id), user.id);
  }

  @RightsDecorator(['read', 'delete'])
  @Delete('/:project_id/tasks/:task_id')
  @ApiOperation({
    summary: 'Delete project task',
    operationId: 'deleteProjectTask',
  })
  @ApiResponse({ status: 200, type: ProjectTaskDto })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiParam({ name: 'project_id', type: String, required: true })
  @ApiParam({ name: 'task_id', type: Number, required: true })
  async deleteProjectTask(@Req() request: ExtendedRequest) {
    const { params } = request;

    if (!params?.task_id || Number.isNaN(Number(params?.task_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.projectService.deleteProjectTask(Number(params.task_id));
  }

  @RightsDecorator(['read', 'delete'])
  @Delete('/:project_id/columns/:column_id')
  @ApiOperation({
    summary: 'Delete project column',
    operationId: 'deleteProjectColumn',
  })
  @ApiResponse({ status: 200, type: ProjectColumn })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiParam({ name: 'project_id', type: Number, required: true })
  @ApiParam({ name: 'column_id', type: String, required: true })
  async deleteProjectColumn(@Req() request: ExtendedRequest) {
    const { params } = request;

    if (
      !params?.column_id ||
      !params?.project_id ||
      Number.isNaN(Number(params?.project_id))
    ) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return this.projectService.deleteProjectColumn(
      params.column_id,
      Number(params.project_id),
    );
  }
}
