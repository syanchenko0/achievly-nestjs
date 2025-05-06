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

    const user = await this.usersService.getUserById(userId);

    if (!user) throw new BadRequestException(WRONG_TOKEN);

    const goal = await this.goalRepository.save(
      new CreateGoalDto({
        ...(data as CreateGoalBody),
        user,
      }),
    );

    if (data?.tasks) {
      for (const task of data.tasks) {
        await this.taskRepository.save(new CreateTaskDto({ ...task, goal }));
      }
    }

    return new GoalDto(goal);
  }

  async getGoals(user: RequestUser, query?: Record<string, unknown>) {
    const { data, error } = GetGoalsSchema.safeParse(query);

    if (error) throw new BadRequestException(WRONG_PARAMS);

    const goals = await this.goalRepository.find({
      where: { user: { id: user.id } },
      relations: ['tasks'],
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
      const tasksTransformed = data.tasks.map((task) => ({
        id: task?.id || -1,
        title: task.title,
        deadlineDate: task?.deadlineDate,
        note: task?.note,
        doneDate: task?.doneDate,
        goal,
      }));

      await this.taskRepository.upsert(tasksTransformed, ['id']);
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

  async deleteGoal(params: Record<string, unknown>) {
    if (!params?.id) throw new BadRequestException(WRONG_PARAMS);

    await this.goalRepository.delete({ id: Number(params.id) });
  }
}
