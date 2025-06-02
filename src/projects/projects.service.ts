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
  ProjectTaskEntity,
} from '@/projects/entities/projects.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateProjectBody,
  CreateProjectTaskBody,
  UpdateProjectBody,
  UpdateProjectTaskBody,
} from '@/projects/dto/swagger.dto';
import {
  PROJECT_CREATE_FORBIDDEN,
  PROJECT_NOT_FOUND,
  PROJECT_TASK_NOT_FOUND,
  PROJECT_UPDATE_FORBIDDEN,
  TEAM_NOT_FOUND,
  USER_NOT_FOUND,
  WRONG_BODY,
} from '@/app/constants/error.constant';
import {
  createProjectSchema,
  createProjectTaskSchema,
  updateProjectSchema,
  updateProjectTaskSchema,
} from '@/projects/schemas/projects.schema';
import { ProjectDto, ProjectTaskDto } from '@/projects/dto/projects.dto';
import { findOwner } from '@/teams/teams.helper';
import {
  DEFAULT_PROJECT_COLUMNS,
  PROJECT_TASK_PRIORITY,
} from '@/projects/constants/projects.constant';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(ProjectTaskEntity)
    private readonly projectTaskRepository: Repository<ProjectTaskEntity>,
    private readonly usersService: UsersService,
    private readonly teamsService: TeamsService,
  ) {}

  async getProjects(team_id: number, user_id: number) {
    const projects = await this.projectRepository.find({
      where: { team: { id: team_id } },
      relations: ['team', 'team.members', 'project_tasks'],
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
      relations: ['team', 'team.members', 'project_tasks'],
    });

    if (!project) {
      throw new NotFoundException(PROJECT_NOT_FOUND);
    }

    return new ProjectDto(project, user_id);
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

    const team = await this.teamsService.getTeamById(team_id);

    if (!team) {
      throw new BadRequestException(TEAM_NOT_FOUND);
    }

    if (!findOwner(team.members, user.id)) {
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
      project,
    });

    return new ProjectTaskDto(project_task);
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

    const member = project.team.members.find(
      (member) => member.user.id === user_id,
    );

    if (!member) {
      throw new BadRequestException(PROJECT_NOT_FOUND);
    }

    const right = member.projects_rights?.find(
      (right) => right.project_id === project_id,
    );

    if (!right?.update) {
      throw new ForbiddenException(PROJECT_UPDATE_FORBIDDEN);
    }

    if (
      body?.columns?.length &&
      !body?.columns?.some((column) => !column.removable)
    ) {
      throw new BadRequestException(WRONG_BODY);
    }

    await this.projectRepository.update(project_id, {
      name: body?.name ?? project.name,
      columns:
        body?.columns?.map((column) => {
          if (!column.id) {
            return {
              ...column,
              id: uuid(),
              removable: true,
            };
          }

          return column;
        }) ?? project.columns,
    });

    return new ProjectDto(project, user_id);
  }

  async updateProjectTask(
    user_id: number,
    project_id: number,
    task_id: number,
    body: UpdateProjectTaskBody,
  ) {
    const { error } = updateProjectTaskSchema.safeParse(body);

    if (error) {
      throw new BadRequestException(WRONG_BODY);
    }

    const project = await this.projectRepository.findOne({
      where: { id: project_id },
      relations: ['team', 'team.members', 'project_tasks'],
    });

    if (!project) {
      throw new NotFoundException(PROJECT_NOT_FOUND);
    }

    const project_task = project.project_tasks?.find(
      (task) => task.id === task_id,
    );

    if (!project_task) {
      throw new NotFoundException(PROJECT_TASK_NOT_FOUND);
    }

    const member = project.team.members.find(
      (member) => member.user.id === user_id,
    );

    if (!member) {
      throw new BadRequestException(PROJECT_NOT_FOUND);
    }

    const right = member.projects_rights?.find(
      (right) => right.project_id === project_id,
    );

    if (!right?.update) {
      throw new ForbiddenException(PROJECT_UPDATE_FORBIDDEN);
    }

    await this.projectTaskRepository.update(task_id, {
      name: body?.name ?? project_task.name,
      description: body?.description ?? project_task?.description,
      column: body?.column ?? project_task.column,
      priority:
        (body?.priority as PROJECT_TASK_PRIORITY) ?? project_task?.priority,
      executor: body?.executor_member_id
        ? project.team.members.find(
            (member) => member.id === body?.executor_member_id,
          )
        : project_task?.executor,
    });

    return new ProjectTaskDto(project_task);
  }
}
