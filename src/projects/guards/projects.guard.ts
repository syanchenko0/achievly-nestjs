import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  PROJECT_NOT_FOUND,
  WRONG_PARAMS,
  WRONG_TOKEN,
} from '@/app/constants/error.constant';
import { ExtendedRequest } from '@/app/types/common.type';
import { Repository } from 'typeorm';
import { ProjectEntity } from '@/projects/entities/projects.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
class ProjectIncludeGuard implements CanActivate {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: ExtendedRequest = context.switchToHttp().getRequest();

    const { params, query } = request;

    if (!request.user) {
      throw new UnauthorizedException(WRONG_TOKEN);
    }

    const requestProjectId = params?.project_id || query?.project_id;

    if (!requestProjectId && Number.isNaN(Number(requestProjectId))) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    const project = await this.projectRepository.findOne({
      where: { id: Number(requestProjectId) },
      relations: ['team', 'team.members'],
    });

    if (!project) {
      throw new NotFoundException(PROJECT_NOT_FOUND);
    }

    const member = project.team.members.find(
      (member) => member.user.id === request.user.id,
    );

    if (!member) {
      throw new BadRequestException(PROJECT_NOT_FOUND);
    }

    const right = member?.projects_rights?.find(
      (right) => right.project_id === project.id,
    );

    if (!right?.read) {
      throw new BadRequestException(PROJECT_NOT_FOUND);
    }

    return true;
  }
}

export { ProjectIncludeGuard };
