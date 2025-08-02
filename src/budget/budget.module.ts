import { Module } from '@nestjs/common';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { UsersModule } from '@/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetAccountingEntity } from '@/budget/entities/budget.entity';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule,
    TypeOrmModule.forFeature([BudgetAccountingEntity]),
  ],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
