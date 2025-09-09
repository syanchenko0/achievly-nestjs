import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GoalsModule } from './goals/goals.module';
import { EventsModule } from './events/events.module';
import { ProjectsModule } from './projects/projects.module';
import { TeamsModule } from './teams/teams.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppGateway } from './app.gateway';
import { BudgetModule } from './budget/budget.module';
import AppDataSource from './data-source';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    GoalsModule,
    EventsModule,
    ProjectsModule,
    TeamsModule,
    NotificationsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    BudgetModule,
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
