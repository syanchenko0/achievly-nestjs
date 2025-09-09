import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { TeamsService } from '@/teams/teams.service';
import {
  ProjectEntity,
  ProjectParentTaskEntity,
  ProjectTaskEntity,
} from '@/projects/entities/projects.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateProjectBody,
  CreateProjectColumnBody,
  CreateProjectTaskBody,
  ProjectColumn,
  UpdateProjectBody,
  UpdateProjectTaskBody,
  UpdateProjectTaskListOrderBody,
} from '@/projects/dto/swagger.dto';
import {
  COLUMN_IN_USE,
  PROJECT_CREATE_FORBIDDEN,
  PROJECT_NOT_FOUND,
  PROJECT_TASK_NOT_FOUND,
  TASK_NOT_FOUND,
  USER_NOT_FOUND,
  WRONG_BODY,
  WRONG_PARAMS,
} from '@/app/constants/error.constant';
import {
  createProjectColumnSchema,
  CreateProjectParentTask,
  createProjectParentTaskSchema,
  createProjectSchema,
  createProjectTaskSchema,
  projectColumnSchema,
  UpdateProjectParentTask,
  updateProjectParentTaskSchema,
  updateProjectSchema,
  updateProjectTaskListOrderBodySchema,
  updateProjectTaskSchema,
} from '@/projects/schemas/projects.schema';
import {
  ProjectDto,
  ProjectParentTaskDto,
  ProjectTaskDto,
} from '@/projects/dto/projects.dto';
import { findOwner } from '@/teams/teams.helper';
import {
  DEFAULT_PROJECT_COLUMNS,
  PROJECT_TASK_PRIORITY,
} from '@/projects/constants/projects.constant';
import { v4 as uuid } from 'uuid';
import { addDays, isWithinInterval, parseISO } from 'date-fns';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(ProjectTaskEntity)
    private readonly projectTaskRepository: Repository<ProjectTaskEntity>,
    @InjectRepository(ProjectParentTaskEntity)
    private readonly projectParentTaskRepository: Repository<ProjectParentTaskEntity>,
    private readonly usersService: UsersService,
    private readonly teamsService: TeamsService,
  ) {}

  async getProjects(team_id: number, user_id: number) {
    const projects = await this.projectRepository.find({
      where: { team: { id: team_id } },
      relations: [
        'team',
        'team.members',
        'project_tasks',
        'project_parent_tasks',
      ],
    });

    return projects
      .filter((project) => {
        const member = project.team.members.find(
          (member) => member.user.id === user_id,
        );

        const right = member?.projects_rights?.find(
          (right) => right.project_id === project.id,
        );

        return right?.read;
      })
      .sort((a, b) => a.id - b.id)
      .map((project) => ({
        id: project.id,
        name: project.name,
      }));
  }

  async getProject(project_id: number, user_id: number) {
    const project = await this.projectRepository.findOne({
      where: { id: project_id },
      relations: [
        'team',
        'team.members',
        'project_tasks',
        'project_tasks.parent_task',
        'project_parent_tasks',
        'project_parent_tasks.project_tasks',
      ],
    });

    if (!project) {
      throw new NotFoundException(PROJECT_NOT_FOUND);
    }

    return new ProjectDto(project, user_id);
  }

  async getProjectsGeneralInfo(team_id: number, user_id: number) {
    const projects = await this.projectRepository.find({
      where: { team: { id: team_id } },
      relations: ['team', 'team.members', 'project_tasks'],
    });

    if (!projects?.length) {
      throw new NotFoundException(PROJECT_NOT_FOUND);
    }

    const today = new Date();

    const threeDaysAgo = addDays(today, 3);

    const upcomingDeadlineTasks = projects.map((project) => ({
      ...project,
      project_tasks: (project.project_tasks ?? [])?.filter((task) => {
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

    const assignedMeTasks = projects.map((project) => ({
      ...project,
      project_tasks: (project.project_tasks ?? [])?.filter((task) => {
        if (task.executor) {
          return task.executor.user.id === user_id;
        }
        return false;
      }),
    }));

    return {
      upcoming_deadline: upcomingDeadlineTasks.map(
        (project) => new ProjectDto(project, user_id),
      ),
      assigned_me: assignedMeTasks.map(
        (project) => new ProjectDto(project, user_id),
      ),
    };
  }

  async createProject(
    user_id: number,
    team_id: number,
    body: CreateProjectBody,
  ) {
    const user = await this.usersService.getUserById(user_id);

    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    const team = await this.teamsService.getTeamById(team_id, user_id);

    if (!findOwner(team.members, user_id)) {
      throw new ForbiddenException(PROJECT_CREATE_FORBIDDEN);
    }

    const { error } = createProjectSchema.safeParse(body);

    if (error) {
      throw new BadRequestException(WRONG_BODY);
    }

    const project = await this.projectRepository.save({
      name: body.name,
      columns: DEFAULT_PROJECT_COLUMNS,
      team,
      user,
    });

    await this.teamsService.addProjectsRights(
      team.id,
      project.id,
      project.name,
    );

    return new ProjectDto(project, user_id);
  }

  async createProjectTask(
    user_id: number,
    project_id: number,
    body: CreateProjectTaskBody,
  ) {
    const { error } = createProjectTaskSchema.safeParse(body);

    if (error) {
      throw new BadRequestException(WRONG_BODY);
    }

    const project = await this.projectRepository.findOne({
      where: { id: project_id },
      relations: ['team', 'team.members'],
    });

    if (!project) {
      throw new NotFoundException(PROJECT_NOT_FOUND);
    }

    const author = project.team.members.find(
      (member) => member.user.id === user_id,
    );

    const executor = project.team.members.find(
      (member) => member.id === body?.executor_member_id,
    );

    const biggestListOrderTask = await this.projectTaskRepository
      .createQueryBuilder('project_task')
      .where("project_task.column->>'id' = :id", { id: body.column.id })
      .orderBy('project_task.list_order', 'DESC')
      .getOne();

    const project_task = await this.projectTaskRepository.save({
      name: body.name,
      description: body?.description,
      column: body.column,
      author: author,
      executor: executor,
      priority: body?.priority as PROJECT_TASK_PRIORITY,
      list_order: (biggestListOrderTask?.list_order ?? -1) + 1,
      deadline_date: body?.deadline_date,
      project,
    });

    if (body?.parent_task_id) {
      const project_parent_task =
        await this.projectParentTaskRepository.findOne({
          where: { id: body.parent_task_id },
          relations: ['project_tasks'],
        });

      if (!project_parent_task) return;

      project_parent_task.project_tasks = [
        ...(project_parent_task?.project_tasks ?? []),
        project_task,
      ];

      await this.projectParentTaskRepository.save(project_parent_task);

      return new ProjectTaskDto({
        ...project_task,
        parent_task: project_parent_task,
      });
    }

    return new ProjectTaskDto(project_task);
  }

  async createProjectParentTask(
    user_id: number,
    project_id: number,
    body: CreateProjectParentTask,
  ) {
    const { error } = createProjectParentTaskSchema.safeParse(body);

    if (error) {
      throw new BadRequestException(WRONG_BODY);
    }

    const project = await this.projectRepository.findOne({
      where: { id: project_id },
      relations: ['team', 'team.members'],
    });

    if (!project) {
      throw new NotFoundException(PROJECT_NOT_FOUND);
    }

    const author = project.team.members.find(
      (member) => member.user.id === user_id,
    );

    const project_parent_task = await this.projectParentTaskRepository.save({
      name: body.name,
      description: body?.description,
      author: author,
      deadline_date: body?.deadline_date,
      project,
    });

    return new ProjectParentTaskDto(project_parent_task);
  }

  async createProjectColumn(project_id: number, body: CreateProjectColumnBody) {
    const { error } = createProjectColumnSchema.safeParse(body);

    if (error) {
      throw new BadRequestException(WRONG_BODY);
    }

    const project = await this.projectRepository.findOne({
      where: { id: project_id },
      relations: ['team', 'team.members'],
    });

    if (!project) {
      throw new NotFoundException(PROJECT_NOT_FOUND);
    }

    const newColumn = {
      ...body,
      id: uuid(),
      order: project.columns.length,
    };

    await this.projectRepository.update(project.id, {
      columns: [...project.columns, newColumn],
    });

    return newColumn;
  }

  async updateProject(
    user_id: number,
    project_id: number,
    body: UpdateProjectBody,
  ) {
    const { error } = updateProjectSchema.safeParse(body);

    if (error) {
      throw new BadRequestException(WRONG_BODY);
    }

    const project = await this.projectRepository.findOne({
      where: { id: project_id },
      relations: ['team', 'team.members'],
    });

    if (!project) {
      throw new NotFoundException(PROJECT_NOT_FOUND);
    }

    if (
      body?.columns?.length &&
      !body?.columns?.some((column) => !column.is_removable)
    ) {
      throw new BadRequestException(WRONG_BODY);
    }

    await this.projectRepository.update(project_id, {
      name: body?.name ?? project.name,
      columns: body?.columns ?? project.columns,
    });

    return new ProjectDto(project, user_id);
  }

  async updateProjectColumn(
    user_id: number,
    project_id: number,
    column_id: string,
    body: ProjectColumn,
  ) {
    const { error } = projectColumnSchema.safeParse(body);

    if (error) {
      throw new BadRequestException(WRONG_BODY);
    }

    const project = await this.projectRepository.findOne({
      where: { id: project_id },
      relations: ['team', 'team.members'],
    });

    if (!project) {
      throw new NotFoundException(PROJECT_NOT_FOUND);
    }

    await this.projectRepository.update(project_id, {
      columns: project.columns.map((column) => {
        if (column.id === column_id) {
          return {
            ...column,
            ...body,
          };
        }

        return column;
      }),
    });

    return new ProjectDto(project, user_id);
  }

  async updateProjectTask(
    project_id: number,
    task_id: number,
    body: UpdateProjectTaskBody,
  ) {
    const { error } = updateProjectTaskSchema.safeParse(body);

    if (error) {
      throw new BadRequestException(WRONG_BODY);
    }

    const project_task = await this.projectTaskRepository.findOne({
      where: { id: task_id },
      relations: [
        'parent_task',
        'project',
        'project.team',
        'project.team.members',
      ],
    });

    if (!project_task) {
      throw new NotFoundException(PROJECT_TASK_NOT_FOUND);
    }

    const project_parent_task = await this.projectParentTaskRepository.findOne({
      where: { id: body?.parent_task_id ?? project_task?.parent_task?.id },
    });

    project_task.name = body?.name ?? project_task.name;
    project_task.description = body?.description ?? project_task.description;
    project_task.column = body?.column ?? project_task.column;
    project_task.priority = body?.priority as PROJECT_TASK_PRIORITY;
    project_task.executor =
      typeof body?.executor_member_id === 'number'
        ? (project_task.project.team.members.find(
            (member) => member.id === body?.executor_member_id,
          ) ?? project_task?.executor)
        : null;
    project_task.deadline_date = body?.deadline_date;
    project_task.done_date = body?.done_date;
    project_task.parent_task =
      typeof body?.parent_task_id === 'number' ? project_parent_task : null;

    await this.projectTaskRepository.save(project_task);

    return new ProjectTaskDto(project_task);
  }

  async updateProjectParentTask(
    project_id: number,
    parent_task_id: number,
    body: UpdateProjectParentTask,
  ) {
    const { error } = updateProjectParentTaskSchema.safeParse(body);

    if (error) {
      throw new BadRequestException(WRONG_BODY);
    }

    const project_parent_task = await this.projectParentTaskRepository.findOne({
      where: { id: parent_task_id },
      relations: ['project_tasks'],
    });

    const project_tasks = await this.projectTaskRepository.find({
      where: { id: In(body?.project_task_ids ?? []) },
      relations: ['parent_task'],
    });

    if (!project_parent_task) {
      throw new NotFoundException(PROJECT_TASK_NOT_FOUND);
    }

    project_parent_task.name = body?.name ?? project_parent_task.name;
    project_parent_task.description =
      body?.description ?? project_parent_task?.description;
    project_parent_task.deadline_date =
      body?.deadline_date ?? project_parent_task.deadline_date;
    project_parent_task.done_date =
      body?.done_date ?? project_parent_task.done_date;
    project_parent_task.project_tasks =
      project_tasks ?? project_parent_task?.project_tasks;

    await this.projectParentTaskRepository.save(project_parent_task);

    return new ProjectParentTaskDto(project_parent_task);
  }

  async updateProjectTaskListOrder(body: UpdateProjectTaskListOrderBody[]) {
    const { error } = updateProjectTaskListOrderBodySchema.safeParse(body);

    if (error) {
      throw new BadRequestException(WRONG_BODY);
    }

    const response: ProjectTaskEntity[] = [];

    for (const task of body) {
      const project_task = await this.projectTaskRepository.findOne({
        where: { id: task.id },
        relations: ['parent_task', 'project'],
      });

      if (!project_task) {
        throw new NotFoundException(PROJECT_TASK_NOT_FOUND);
      }

      project_task.list_order = task.list_order;

      await this.projectTaskRepository.save(project_task);

      response.push(project_task);
    }

    return response.sort((a, b) => a.list_order - b.list_order);
  }

  async deleteProject(project_id: number, user_id: number) {
    const project = await this.projectRepository.findOne({
      where: { id: project_id },
      relations: ['team', 'team.members', 'project_tasks'],
    });

    if (!project) {
      throw new NotFoundException(PROJECT_NOT_FOUND);
    }

    await this.teamsService.removeProjectsRights(project.team.id, project.id);

    await this.projectTaskRepository.delete({ project: { id: project_id } });

    await this.projectRepository.delete(project_id);

    return new ProjectDto(project, user_id);
  }

  async deleteProjectTask(task_id: number) {
    const task = await this.projectTaskRepository.findOneBy({ id: task_id });

    if (!task) {
      throw new NotFoundException(TASK_NOT_FOUND);
    }

    await this.projectTaskRepository.delete(task_id);

    return new ProjectTaskDto(task);
  }

  async deleteProjectParentTask(parent_task_id: number) {
    const parent_task = await this.projectParentTaskRepository.findOneBy({
      id: parent_task_id,
    });

    if (!parent_task) {
      throw new NotFoundException(TASK_NOT_FOUND);
    }

    await this.projectParentTaskRepository.delete(parent_task_id);

    return new ProjectParentTaskDto(parent_task);
  }

  async deleteProjectColumn(column_id: string, project_id: number) {
    const project = await this.projectRepository.findOneBy({ id: project_id });

    if (!project) {
      throw new NotFoundException(PROJECT_NOT_FOUND);
    }

    const column = project.columns.find((column) => column.id === column_id);

    if (!column) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    if (project.project_tasks?.some((task) => task.column.id === column.id)) {
      throw new BadRequestException(COLUMN_IN_USE);
    }

    await this.projectRepository.update(project_id, {
      columns: project.columns.filter((column) => column.id !== column_id),
    });

    return column;
  }
}
