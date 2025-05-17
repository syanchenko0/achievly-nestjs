import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from '@/teams/entities/team.entity';
import { UsersModule } from '@/users/users.module';
import { NotificationsModule } from '@/notifications/notifications.module';
import { MemberEntity } from '@/teams/entities/member.entity';

@Module({
  imports: [
    UsersModule,
    NotificationsModule,
    ConfigModule,
    JwtModule,
    TypeOrmModule.forFeature([TeamEntity, MemberEntity]),
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
