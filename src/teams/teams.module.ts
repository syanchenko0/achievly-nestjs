import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from '@/teams/entities/team.entity';
import { InvitationTeamEntity } from '@/teams/entities/invitation.entity';
import { UsersModule } from '@/users/users.module';
import { NotificationsModule } from '@/notifications/notifications.module';

@Module({
  imports: [
    UsersModule,
    NotificationsModule,
    ConfigModule,
    JwtModule,
    TypeOrmModule.forFeature([TeamEntity, InvitationTeamEntity]),
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
