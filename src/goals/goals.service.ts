import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateGoalBody,
  CreateGoalDto,
  GoalDto,
  UpdateGoalBody,
} from '@/goals/dto/goal.dto';
import { UsersService } from '@/users/users.service';
import { RequestUser } from '@/app/types/common.type';
import {
  CreateGoalDtoSchema,
  GetGoalsSchema,
  UpdateGoalDtoSchema,
} from '@/goals/schemas/goal.schema';
import {
  WRONG_BODY,
  WRONG_PARAMS,
  WRONG_TOKEN,
} from '@/app/constants/error.constant';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoalEntity } from '@/goals/entities/goal.entity';
import { TaskEntity } from '@/goals/entities/task.entity';
import { CreateTaskDto } from '@/goals/dto/task.dto';

@Injectable()
export class GoalsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(GoalEntity)
    private readonly goalRepository: Repository<GoalEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async createGoal({ id: userId }: RequestUser, body: Record<string, unknown>) {
    const { data, error } = CreateGoalDtoSchema.safeParse(body);

    if (error) throw new BadRequestException(WRONG_BODY);

    const tasks: TaskEntity[] = [];

    if (data?.tasks) {
      for (const task of data.tasks) {
        const result = await this.taskRepository.save(new CreateTaskDto(task));
        tasks.push(result);
      }
    }

    const user = await this.usersService.getUserById(userId);

    if (!user) throw new BadRequestException(WRONG_TOKEN);

    const goal = await this.goalRepository.save(
      new CreateGoalDto({
        ...(data as CreateGoalBody),
        user,
        tasks,
      }),
    );

    return new GoalDto(goal);
  }

  async getGoals(user: RequestUser, query?: Record<string, unknown>) {
    const { data, error } = GetGoalsSchema.safeParse(query);

    if (error) throw new BadRequestException(WRONG_PARAMS);

    const goals = await this.usersService.getEntityRelations({
      user_id: user.id,
      entity: 'goals',
    });

    if (data?.status) {
      return (goals || [])
        .filter((goal) => goal.status === data.status)
        .map((goal) => new GoalDto(goal));
    }

    return (goals || []).map((goal) => new GoalDto(goal));
  }

  async updateGoal(
    params: Record<string, unknown>,
    body: Record<string, unknown>,
  ) {
    const { data, error } = UpdateGoalDtoSchema.safeParse(body);

    if (error) throw new BadRequestException(WRONG_BODY);

    if (!params?.id) throw new BadRequestException(WRONG_PARAMS);

    const goal = await this.goalRepository.findOneBy({
      id: Number(params.id),
    });

    if (!goal) throw new BadRequestException(WRONG_PARAMS);

    if (data?.tasks?.length) {
      await this.taskRepository.upsert(data.tasks, ['id']);
    }

    await this.goalRepository.update(goal.id, {
      title: (data as UpdateGoalBody)?.title || goal?.title,
      category: (data as UpdateGoalBody)?.category || goal?.category,
      status: (data as UpdateGoalBody)?.status || goal?.status,
      deadlineDate:
        (data as UpdateGoalBody)?.deadlineDate || goal?.deadlineDate,
      note: (data as UpdateGoalBody)?.note || goal?.note,
      achievedDate:
        (data as UpdateGoalBody)?.achievedDate || goal?.achievedDate,
    });
  }
}
