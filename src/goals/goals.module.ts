import { Module } from '@nestjs/common';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { UsersModule } from '@/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalEntity } from '@/goals/entities/goal.entity';
import { TaskEntity } from '@/goals/entities/task.entity';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule,
    TypeOrmModule.forFeature([GoalEntity, TaskEntity]),
  ],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalsModule {}
