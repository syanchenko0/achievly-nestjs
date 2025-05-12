import {
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
import { CreateGoalBody, UpdateGoalBody } from '@/goals/dto/swagger.dto';
import { UpdateResult } from 'typeorm';

@ApiTags('Goals')
@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

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

  @Get('/')
  @ApiOperation({ operationId: 'getGoals', summary: 'Get goals' })
  @ApiResponse({ status: 200, type: GoalDto, isArray: true })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiQuery({ type: String, name: 'status', required: false })
  async getGoals(@Req() request: ExtendedRequest) {
    const { user, query } = request;

    return this.goalsService.getGoals(user, query);
  }

  @Patch('/:id')
  @ApiOperation({ operationId: 'updateGoal', summary: 'Update goal' })
  @ApiResponse({ status: 200, type: UpdateResult })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiBody({ type: UpdateGoalBody })
  @ApiParam({ name: 'id', type: String })
  async updateGoal(
    @Req() request: Omit<ExtendedRequest, 'body'> & { body: UpdateGoalBody },
  ) {
    const { params, body } = request;

    return await this.goalsService.updateGoal(Number(params.id), body);
  }

  @Delete('/:id')
  @ApiOperation({ operationId: 'deleteGoal', summary: 'Delete goal' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: BadRequest })
  @ApiParam({ name: 'id', type: String })
  async deleteGoal(@Req() request: ExtendedRequest) {
    const { params } = request;

    return await this.goalsService.deleteGoal(Number(params.id));
  }
}
