import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  GOAL_NOT_FOUND,
  GOAL_UPDATE_FORBIDDEN,
  TASK_NOT_FOUND,
  TASK_UPDATE_FORBIDDEN,
  WRONG_PARAMS,
  WRONG_TOKEN,
} from '@/app/constants/error.constant';
import { ExtendedRequest } from '@/app/types/common.type';
import { InjectRepository } from '@nestjs/typeorm';
import { GoalEntity } from '@/goals/entities/goal.entity';
import { Repository } from 'typeorm';
import { TaskEntity } from '@/goals/entities/task.entity';

@Injectable()
class GoalIncludeGuard implements CanActivate {
  constructor(
    @InjectRepository(GoalEntity)
    private readonly goalRepository: Repository<GoalEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: ExtendedRequest = context.switchToHttp().getRequest();

    const { params, query } = request;

    if (!request.user) {
      throw new UnauthorizedException(WRONG_TOKEN);
    }

    const requestGoalId = params?.goal_id || query?.goal_id;

    if (!requestGoalId && Number.isNaN(Number(requestGoalId))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    const goal = await this.goalRepository.findOne({
      where: { id: Number(requestGoalId) },
      relations: ['user'],
    });

    if (!goal) {
      throw new BadRequestException(GOAL_NOT_FOUND);
    }

    if (goal.user.id !== request.user.id) {
      throw new ForbiddenException(GOAL_UPDATE_FORBIDDEN);
    }

    return true;
  }
}

@Injectable()
class TaskIncludeGuard implements CanActivate {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: ExtendedRequest = context.switchToHttp().getRequest();

    const { params, query } = request;

    if (!request.user) {
      throw new UnauthorizedException(WRONG_TOKEN);
    }

    const requestTaskId = params?.task_id || query?.task_id;

    if (!requestTaskId && Number.isNaN(Number(requestTaskId))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    const task = await this.taskRepository.findOne({
      where: { id: Number(requestTaskId) },
      relations: ['goal', 'goal.user'],
    });

    if (!task) {
      throw new BadRequestException(TASK_NOT_FOUND);
    }

    if (task.goal.user.id !== request.user.id) {
      throw new ForbiddenException(TASK_UPDATE_FORBIDDEN);
    }

    return true;
  }
}

export { GoalIncludeGuard, TaskIncludeGuard };
