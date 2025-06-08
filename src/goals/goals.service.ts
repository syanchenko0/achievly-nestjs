import { BadRequestException, Injectable } from '@nestjs/common';
import { GoalDto } from '@/goals/dto/goal.dto';
import { UsersService } from '@/users/users.service';
import { RequestUser } from '@/app/types/common.type';
import {
  CreateGoalSchema,
  GetGoalsSchema,
  GetTasksSchema,
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
  TaskStatusEnum,
} from '@/goals/constants/goal.constant';
import { TaskDto } from '@/goals/dto/task.dto';
import { addDays, isWithinInterval, parseISO } from 'date-fns';

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
    const { error } = CreateGoalSchema.safeParse(body);

    if (error) throw new BadRequestException(WRONG_BODY);

    const user = await this.usersService.getUserById(userId);

    if (!user) throw new BadRequestException(WRONG_TOKEN);

    const biggestListOrderGoal = await this.goalRepository
      .createQueryBuilder('goal')
      .where('goal.achieved_date IS NULL')
      .orderBy('goal.list_order', 'DESC')
      .limit(1)
      .getOne();

    const goal = await this.goalRepository.save({
      title: body.title,
      category: body.category,
      status: GoalStatusEnum.Ongoing,
      deadline_date: body?.deadline_date,
      list_order: (biggestListOrderGoal?.list_order ?? -1) + 1,
      note: body?.note,
      user,
    });

    if (body?.tasks) {
      const biggestListOrderTask = await this.taskRepository
        .createQueryBuilder('task')
        .where('task.done_date IS NULL')
        .orderBy('task.list_order', 'DESC')
        .limit(1)
        .getOne();

      const transformedTasks = body.tasks.map((task, index) => ({
        ...task,
        list_order: (biggestListOrderTask?.list_order ?? -1) + (index + 1),
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
        .sort((a, b) => (a.list_order ?? 0) - (b.list_order ?? 0))
        .map((goal) => new GoalDto(goal));
    }

    return (goals || [])
      .sort((a, b) => (a.list_order ?? 0) - (b.list_order ?? 0))
      .map((goal) => new GoalDto(goal));
  }

  async getGoalsGeneralInfo(user_id: number) {
    const goals = await this.goalRepository.find({
      where: { user: { id: user_id } },
      relations: ['tasks'],
    });

    const today = new Date();

    const threeDaysAgo = addDays(today, 3);

    const upcomingDeadlineTasks = (goals ?? []).map((goal) => ({
      ...goal,
      tasks: (goal.tasks ?? [])?.filter((task) => {
        if (task.deadline_date) {
          const deadline_date = parseISO(task.deadline_date);
          return isWithinInterval(deadline_date, {
            start: threeDaysAgo,
            end: today,
          });
        }
        return false;
      }),
    }));

    return upcomingDeadlineTasks.map((goal) => new GoalDto(goal));
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
      const biggestListOrderTask = await this.taskRepository
        .createQueryBuilder('task')
        .where('task.done_date IS NULL')
        .orderBy('task.list_order', 'DESC')
        .limit(1)
        .getOne();

      let newTaskIndex = 0;

      const tasksTransformed = body.tasks.map((task, index) => {
        if (task?.id === undefined) {
          newTaskIndex++;
          return {
            ...task,
            goal_list_order: index,
            list_order: (biggestListOrderTask?.list_order ?? -1) + newTaskIndex,
            goal,
          };
        }

        return {
          ...task,
          goal_list_order: index,
          goal,
        };
      });

      await this.taskRepository.save(tasksTransformed);

      const tasksForDelete = goal.tasks?.filter(
        (task) => !body?.tasks?.find((t) => t.id === task.id),
      );

      if (tasksForDelete.length) {
        await this.taskRepository.remove(tasksForDelete);
      }
    }

    if (!body?.tasks?.length && goal?.tasks?.length) {
      await this.taskRepository.remove(goal.tasks);
    }

    return await this.goalRepository.update(goal.id, {
      title: body?.title || goal?.title,
      category: (body?.category as GoalCategoryEnum) || goal.category,
      status: (body?.status as GoalStatusEnum) || goal.status,
      deadline_date: body?.deadline_date,
      note: body?.note,
      achieved_date: body?.achieved_date,
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

  async getTasks(user: RequestUser, query?: Record<string, unknown>) {
    const { error } = GetTasksSchema.safeParse(query);

    if (error) throw new BadRequestException(WRONG_PARAMS);

    const tasks = await this.taskRepository.find({
      where: { goal: { user: { id: user.id } } },
      relations: ['goal'],
    });

    if (query?.status) {
      return tasks
        .filter((task) =>
          query?.status === TaskStatusEnum.Done
            ? task.done_date
            : !task.done_date,
        )
        .sort((a, b) => (a.list_order ?? 0) - (b.list_order ?? 0))
        .map((task) => new TaskDto(task));
    }

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

    return await this.taskRepository.save({
      ...task,
      title: body?.title,
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
