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
import { GoalsService } from '@/goals/goals.service';
import { BadRequest, ExtendedRequest } from '@/app/types/common.type';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/auth.guard';
import { GoalDto } from '@/goals/dto/goal.dto';
import {
  CreateGoalBody,
  UpdateGoalBody,
  UpdateGoalListOrderBody,
  UpdateTaskBody,
  UpdateTaskListOrderBody,
} from '@/goals/dto/swagger.dto';
import { UpdateResult } from 'typeorm';
import { WRONG_PARAMS } from '@/app/constants/error.constant';
import { GoalIncludeGuard, TaskIncludeGuard } from '@/goals/guards/goals.guard';
import { TaskDto } from '@/goals/dto/task.dto';

@ApiTags('Goals')
@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get('/')
  @ApiOperation({ operationId: 'getGoals', summary: 'Get goals' })
  @ApiResponse({ status: 200, type: GoalDto, isArray: true })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiQuery({ type: String, name: 'status', required: false })
  async getGoals(@Req() request: ExtendedRequest) {
    const { user, query } = request;

    return this.goalsService.getGoals(user, query);
  }

  @Get('/tasks')
  @ApiOperation({ operationId: 'getTasks', summary: 'Get tasks' })
  @ApiResponse({ status: 200, type: TaskDto, isArray: true })
  @ApiResponse({ status: 400, type: BadRequest })
  async getTasks(@Req() request: ExtendedRequest) {
    const { user } = request;

    return this.goalsService.getTasks(user);
  }

  @Post('/')
  @ApiOperation({ operationId: 'createGoal', summary: 'Create goal' })
  @ApiResponse({ status: 200, type: GoalDto })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: CreateGoalBody })
  async createGoal(
    @Req() request: Omit<ExtendedRequest, 'body'> & { body: CreateGoalBody },
  ) {
    const { user, body } = request;

    return this.goalsService.createGoal(user, body);
  }

  @Post('/list_order')
  @ApiOperation({
    operationId: 'updateGoalListOrder',
    summary: 'Update goal list order',
  })
  @ApiResponse({ status: 200, type: UpdateResult })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: UpdateGoalListOrderBody, isArray: true })
  async updateGoalListOrder(
    @Req()
    request: Omit<ExtendedRequest, 'body'> & {
      body: UpdateGoalListOrderBody[];
    },
  ) {
    const { body } = request;

    return await this.goalsService.updateGoalListOrder(body);
  }

  @Post('/tasks/list_order')
  @ApiOperation({
    operationId: 'updateTaskListOrder',
    summary: 'Update task list order',
  })
  @ApiResponse({ status: 200, type: UpdateResult })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: UpdateTaskListOrderBody, isArray: true })
  async updateTaskListOrder(
    @Req()
    request: Omit<ExtendedRequest, 'body'> & {
      body: UpdateTaskListOrderBody[];
    },
  ) {
    const { body } = request;

    return await this.goalsService.updateTaskListOrder(body);
  }

  @UseGuards(GoalIncludeGuard)
  @Patch('/:goal_id')
  @ApiOperation({ operationId: 'updateGoal', summary: 'Update goal' })
  @ApiResponse({ status: 200, type: UpdateResult })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: UpdateGoalBody })
  @ApiParam({ name: 'goal_id', type: String })
  async updateGoal(
    @Req() request: Omit<ExtendedRequest, 'body'> & { body: UpdateGoalBody },
  ) {
    const { params, body } = request;

    if (!params?.goal_id || Number.isNaN(Number(params.goal_id))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return await this.goalsService.updateGoal(Number(params.goal_id), body);
  }

  @UseGuards(TaskIncludeGuard)
  @Patch('/tasks/:task_id')
  @ApiOperation({ operationId: 'updateTask', summary: 'Update task' })
  @ApiResponse({ status: 200, type: UpdateResult })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: UpdateTaskBody })
  @ApiParam({ name: 'task_id', type: String })
  async updateTask(
    @Req() request: Omit<ExtendedRequest, 'body'> & { body: UpdateTaskBody },
  ) {
    const { body } = request;

    return await this.goalsService.updateTask(body);
  }

  @UseGuards(GoalIncludeGuard)
  @Delete('/:goal_id')
  @ApiOperation({ operationId: 'deleteGoal', summary: 'Delete goal' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiParam({ name: 'goal_id', type: String })
  async deleteGoal(@Req() request: ExtendedRequest) {
    const { params } = request;

    return await this.goalsService.deleteGoal(Number(params.goal_id));
  }

  @UseGuards(TaskIncludeGuard)
  @Delete('/tasks/:task_id')
  @ApiOperation({ operationId: 'deleteTask', summary: 'Delete task' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiParam({ name: 'task_id', type: String })
  async deleteTask(@Req() request: ExtendedRequest) {
    const { params } = request;

    return await this.goalsService.deleteTask(Number(params.task_id));
  }
}
