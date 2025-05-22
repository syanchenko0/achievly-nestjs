import { BadRequestException, Injectable } from '@nestjs/common';
import { GoalDto } from '@/goals/dto/goal.dto';
import { UsersService } from '@/users/users.service';
import { RequestUser } from '@/app/types/common.type';
import {
  CreateGoalSchema,
  GetGoalsSchema,
  UpdateGoalSchema,
  UpdateTasksSchema,
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
import {
  CreateGoalBody,
  UpdateGoalBody,
  UpdateTaskBody,
} from '@/goals/dto/swagger.dto';
import {
  GoalCategoryEnum,
  GoalStatusEnum,
} from '@/goals/constants/goal.constant';

@Injectable()
export class GoalsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(GoalEntity)
    private readonly goalRepository: Repository<GoalEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async createGoal({ id: userId }: RequestUser, body: CreateGoalBody) {
    const { data, error } = CreateGoalSchema.safeParse(body);

    if (error || !data) throw new BadRequestException(WRONG_BODY);

    const user = await this.usersService.getUserById(userId);

    if (!user) throw new BadRequestException(WRONG_TOKEN);

    const goal = await this.goalRepository.save({
      title: data.title,
      category: data.category as GoalCategoryEnum,
      status: GoalStatusEnum.Ongoing,
      deadline_date: data?.deadline_date,
      note: data?.note,
      user,
    });

    if (data?.tasks) {
      for (const task of data.tasks) {
        await this.taskRepository.save({
          title: task.title,
          deadline_date: task?.deadline_date,
          note: task?.note,
          goal,
        });
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

  async updateGoal(id: number, body: UpdateGoalBody) {
    const { data, error } = UpdateGoalSchema.safeParse(body);

    if (error) throw new BadRequestException(WRONG_BODY);

    const goal = await this.goalRepository.findOneBy({
      id: Number(id),
    });

    if (!goal) throw new BadRequestException(WRONG_PARAMS);

    if (data?.tasks?.length) {
      const tasksTransformed = data.tasks.map((task) => ({
        id: task?.id || -1,
        title: task.title,
        deadline_date: task?.deadline_date,
        note: task?.note,
        done_date: task?.done_date,
        goal,
      }));

      await this.taskRepository.upsert(tasksTransformed, ['id']);

      const tasksForDelete = goal.tasks.filter(
        (task) => !data?.tasks?.find((t) => t.id === task.id),
      );

      if (tasksForDelete.length) {
        await this.taskRepository.remove(tasksForDelete);
      }
    }

    return await this.goalRepository.update(goal.id, {
      title: data?.title || goal?.title,
      category: (data?.category as GoalCategoryEnum) || goal.category,
      status: (data?.status as GoalStatusEnum) || goal.status,
      deadline_date: data?.deadline_date || goal?.deadline_date,
      note: data?.note || goal?.note,
      achieved_date: data?.achieved_date || goal?.achieved_date,
    });
  }

  async updateTasks(body: UpdateTaskBody[]) {
    const { error } = UpdateTasksSchema.safeParse(body);

    if (error) {
      throw new BadRequestException(WRONG_BODY);
    }

    return await this.taskRepository.save(body);
  }

  async deleteGoal(id: number) {
    return await this.goalRepository.delete({ id });
  }
}
