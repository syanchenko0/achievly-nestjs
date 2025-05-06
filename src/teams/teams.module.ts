import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from '@/teams/entities/team.entity';

@Module({
  imports: [ConfigModule, JwtModule, TypeOrmModule.forFeature([TeamEntity])],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
