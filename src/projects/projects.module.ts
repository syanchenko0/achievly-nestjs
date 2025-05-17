import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from '@/projects/entities/project.entity';
import { UsersModule } from '@/users/users.module';
import { TeamsModule } from '@/teams/teams.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    UsersModule,
    TeamsModule,
    TypeOrmModule.forFeature([ProjectEntity]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
