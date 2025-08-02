import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { And, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import {
  BUDGET_NOT_FOUND,
  USER_NOT_FOUND,
  WRONG_BODY,
} from '@/app/constants/error.constant';
import { BudgetAccountingEntity } from '@/budget/entities/budget.entity';
import { UsersService } from '@/users/users.service';
import {
  BudgetAccountingItem,
  BudgetAccountingItemSchema,
  CreateBudgetAccounting,
  CreateBudgetAccountingSchema,
} from '@/budget/schemas/validate.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { endOfMonth } from 'date-fns';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(BudgetAccountingEntity)
    private readonly budgetAccountingRepository: Repository<BudgetAccountingEntity>,
    private readonly usersService: UsersService,
  ) {}

  async getBudgetAccounting(user_id: number, month: string, year: string) {
    if (!month || !year) {
      throw new BadRequestException(WRONG_BODY);
    }

    const first_date = new Date(+year, +month, 1);
    const last_date = endOfMonth(new Date(+year, +month, 1));

    const budget_accounting =
      (await this.budgetAccountingRepository.find({
        where: {
          user: { id: user_id },
          date: And(MoreThanOrEqual(first_date), LessThanOrEqual(last_date)),
        },
      })) ?? [];

    if (!budget_accounting) {
      throw new NotFoundException(BUDGET_NOT_FOUND);
    }

    const biggest_date_item = await this.budgetAccountingRepository
      .createQueryBuilder('budget_accounting')
      .orderBy('budget_accounting.date', 'DESC')
      .limit(1)
      .getOne();

    const smallest_date_item = await this.budgetAccountingRepository
      .createQueryBuilder('budget_accounting')
      .orderBy('budget_accounting.date', 'ASC')
      .limit(1)
      .getOne();

    return {
      data: {
        income: budget_accounting.filter((item) => item.variant === 'income'),
        expense: budget_accounting.filter((item) => item.variant === 'expense'),
      },
      meta: {
        total: budget_accounting.reduce(
          (acc, item) => {
            if (!item.planned) {
              if (item.variant === 'income') {
                return { ...acc, income: acc.income + item.value };
              }
              return { ...acc, expense: acc.expense + item.value };
            }
            if (item.variant === 'income') {
              return {
                ...acc,
                planned_income: acc.planned_income + item.value,
              };
            }
            return {
              ...acc,
              planned_expense: acc.planned_expense + item.value,
            };
          },
          { income: 0, expense: 0, planned_income: 0, planned_expense: 0 },
        ),
        min_year:
          smallest_date_item?.date?.getFullYear() ?? new Date().getFullYear(),
        max_year:
          biggest_date_item?.date?.getFullYear() ?? new Date().getFullYear(),
      },
    };
  }

  async createBudgetAccounting(user_id: number, body: CreateBudgetAccounting) {
    const user = await this.usersService.getUserById(user_id);

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const { error } = CreateBudgetAccountingSchema.safeParse(body);

    if (error) {
      throw new BadRequestException(WRONG_BODY);
    }

    const new_budget_accounting = await this.budgetAccountingRepository.save({
      name: body.name,
      value: body.value,
      date: body.date,
      planned: body.planned,
      variant: body.variant,
      user,
    });

    return { ...new_budget_accounting, user: undefined };
  }

  async updateBudgetAccounting(user_id: number, body: BudgetAccountingItem) {
    const { error } = BudgetAccountingItemSchema.safeParse(body);

    if (error) {
      throw new BadRequestException(WRONG_BODY);
    }

    const budget_accounting = await this.budgetAccountingRepository.findOne({
      where: { user: { id: user_id }, id: body.id },
    });

    if (!budget_accounting) {
      throw new NotFoundException(BUDGET_NOT_FOUND);
    }

    const updated_budget_accounting =
      await this.budgetAccountingRepository.save({
        id: body.id,
        name: body.name,
        value: body.value,
        date: body.date,
        planned: body.planned,
      });

    return {
      ...updated_budget_accounting,
      variant: budget_accounting.variant,
      user: undefined,
    };
  }

  async deleteBudgetAccounting(user_id: number, id: number) {
    const budget_accounting = await this.budgetAccountingRepository.findOne({
      where: { user: { id: user_id }, id },
    });

    if (!budget_accounting) {
      throw new NotFoundException(BUDGET_NOT_FOUND);
    }

    await this.budgetAccountingRepository.remove(budget_accounting);
  }
}
