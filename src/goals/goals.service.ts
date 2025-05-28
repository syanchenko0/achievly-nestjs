import { BadRequestException, Injectable } from '@nestjs/common';
import { GoalDto } from '@/goals/dto/goal.dto';
import { UsersService } from '@/users/users.service';
import { RequestUser } from '@/app/types/common.type';
import {
  CreateGoalSchema,
  GetGoalsSchema,
  UpdateGoalListOrderBodySchema,
  UpdateGoalSchema,
  UpdateTaskListOrderBodySchema,
  UpdateTaskSchema,
} from '@/goals/schemas/goal.schema';
import {
  GOAL_NOT_FOUND,
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
  UpdateGoalListOrderBody,
  UpdateTaskBody,
  UpdateTaskListOrderBody,
} from '@/goals/dto/swagger.dto';
import {
  GoalCategoryEnum,
  GoalStatusEnum,
} from '@/goals/constants/goal.constant';
import { TaskDto } from '@/goals/dto/task.dto';

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
      const biggestListOrder = (await this.taskRepository
        .createQueryBuilder('task')
        .select('MAX(task.list_order)')
        .getRawOne()) as { max: number | null };

      const transformedTasks = data.tasks.map((task, index) => ({
        ...task,
        list_order:
          biggestListOrder.max !== null
            ? biggestListOrder.max + (index || 1)
            : index,
        goal_list_order: index,
      }));

      for (const task of transformedTasks) {
        await this.taskRepository.save({
          title: task.title,
          deadline_date: task?.deadline_date,
          note: task?.note,
          list_order: task?.list_order,
          goal_list_order: task?.goal_list_order,
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
    const { error } = UpdateGoalSchema.safeParse(body);

    if (error) throw new BadRequestException(WRONG_BODY);

    const goal = await this.goalRepository.findOne({
      where: {
        id: Number(id),
      },
      relations: ['tasks'],
    });

    if (!goal) throw new BadRequestException(WRONG_PARAMS);

    if (body?.tasks?.length) {
      const tasksTransformed = body.tasks.map((task) => ({
        id: task?.id ?? -1,
        title: task.title,
        deadline_date: task?.deadline_date,
        note: task?.note,
        done_date: task?.done_date,
        goal,
      }));

      await this.taskRepository.upsert(tasksTransformed, ['id']);

      const tasksForDelete = goal.tasks?.filter(
        (task) => !body?.tasks?.find((t) => t.id === task.id),
      );

      if (tasksForDelete.length) {
        await this.taskRepository.remove(tasksForDelete);
      }
    }

    return await this.goalRepository.update(goal.id, {
      title: body?.title || goal?.title,
      category: (body?.category as GoalCategoryEnum) || goal.category,
      status: (body?.status as GoalStatusEnum) || goal.status,
      deadline_date: body?.deadline_date,
      note: body?.note,
      achieved_date: body?.achieved_date || goal.achieved_date,
    });
  }

  async updateGoalListOrder(body: UpdateGoalListOrderBody[]) {
    const { error } = UpdateGoalListOrderBodySchema.safeParse(body);

    if (error) {
      throw new BadRequestException(WRONG_BODY);
    }

    for (const goal of body) {
      await this.goalRepository.update(goal.id, {
        list_order: goal.list_order,
      });
    }
  }

  async deleteGoal(id: number) {
    const goal = await this.goalRepository.findOne({ where: { id } });

    if (!goal) {
      throw new BadRequestException(GOAL_NOT_FOUND);
    }

    await this.taskRepository.delete({ goal: { id } });

    return await this.goalRepository.delete({ id });
  }

  async getTasks(user: RequestUser) {
    const tasks = await this.taskRepository.find({
      where: { goal: { user: { id: user.id } } },
      relations: ['goal'],
    });

    return tasks
      .sort((a, b) => (a.list_order ?? 0) - (b.list_order ?? 0))
      .map((task) => new TaskDto(task));
  }

  async updateTask(body: UpdateTaskBody) {
    const { error } = UpdateTaskSchema.safeParse(body);

    if (error) {
      throw new BadRequestException(WRONG_BODY);
    }

    const task = await this.taskRepository.findOneBy({
      id: Number(body.id),
    });

    if (!task) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return await this.taskRepository.update(body.id, {
      title: body?.title || task?.title,
      deadline_date: body?.deadline_date,
      note: body?.note,
      done_date: body?.done_date,
    });
  }

  async updateTaskListOrder(body: UpdateTaskListOrderBody[]) {
    const { error } = UpdateTaskListOrderBodySchema.safeParse(body);

    if (error) {
      throw new BadRequestException(WRONG_BODY);
    }

    for (const task of body) {
      await this.taskRepository.update(task.id, {
        list_order: task.list_order,
      });
    }
  }

  async deleteTask(id: number) {
    return await this.taskRepository.delete({ id });
  }
}
