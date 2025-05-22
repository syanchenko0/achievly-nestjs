import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { TeamsService } from '@/teams/teams.service';
import { ProjectEntity } from '@/projects/entities/project.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProjectBody } from '@/projects/dto/swagger.dto';
import {
  PROJECT_CREATE_FORBIDDEN,
  TEAM_NOT_FOUND,
  USER_NOT_FOUND,
  WRONG_BODY,
} from '@/app/constants/error.constant';
import { createProjectSchema } from '@/projects/schemas/projects.schema';
import { ProjectDto } from '@/projects/dto/projects.dto';
import { findOwner } from '@/teams/teams.helper';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly usersService: UsersService,
    private readonly teamsService: TeamsService,
  ) {}

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

  async getProjects(team_id: number, user_id: number) {
    const projects = await this.projectRepository.find({
      where: { team: { id: team_id } },
      relations: ['team', 'user', 'team.members'],
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
      .map((project) => new ProjectDto(project, user_id));
  }
}
