import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ProjectEntity,
  ProjectParentTaskEntity,
  ProjectTaskEntity,
} from '@/projects/entities/projects.entity';
import { UsersModule } from '@/users/users.module';
import { TeamsModule } from '@/teams/teams.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    UsersModule,
    TeamsModule,
    TypeOrmModule.forFeature([
      ProjectEntity,
      ProjectTaskEntity,
      ProjectParentTaskEntity,
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
