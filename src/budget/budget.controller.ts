import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/auth.guard';
import { BudgetService } from '@/budget/budget.service';
import { BadRequest, ExtendedRequest } from '@/app/types/common.type';
import {
  BudgetAccountingCreateBodySchema,
  BudgetAccountingResponseSchema,
  BudgetAccountingSchema,
} from '@/budget/swagger/budget.swagger';
import { z } from 'zod';
import { WRONG_BODY, WRONG_PARAMS } from '@/app/constants/error.constant';

@ApiTags('Goals')
@UseGuards(JwtAuthGuard)
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get('accounting')
  @ApiOperation({ operationId: 'getBudgetAccounting' })
  @ApiResponse({ status: 200, type: BudgetAccountingResponseSchema })
  @ApiResponse({ status: 404, type: BadRequest })
  @ApiQuery({ name: 'month', required: true, type: 'string' })
  @ApiQuery({ name: 'year', required: true, type: 'string' })
  async getBudgetAccounting(@Req() request: ExtendedRequest) {
    const user_id = request.user.id;

    const { month, year } = request.query;

    const { error, data } = z
      .object({
        month: z.string(),
        year: z.string(),
      })
      .safeParse({ month, year });

    if (error) {
      throw new BadRequestException(WRONG_BODY);
    }

    return await this.budgetService.getBudgetAccounting(
      user_id,
      data.month,
      data.year,
    );
  }

  @Post('accounting/create')
  @ApiOperation({ operationId: 'createBudgetAccounting' })
  @ApiResponse({ status: 200, type: BudgetAccountingSchema })
  @ApiResponse({ status: 404, type: BadRequest })
  @ApiBody({ type: BudgetAccountingCreateBodySchema })
  async createBudgetAccounting(@Req() request: ExtendedRequest) {
    return await this.budgetService.createBudgetAccounting(
      request.user.id,
      request.body as BudgetAccountingCreateBodySchema,
    );
  }

  @Put('accounting/update')
  @ApiOperation({ operationId: 'updateBudgetAccounting' })
  @ApiResponse({ status: 200, type: BudgetAccountingSchema })
  @ApiResponse({ status: 404, type: BadRequest })
  @ApiBody({ type: BudgetAccountingSchema })
  async updateBudgetAccounting(@Req() request: ExtendedRequest) {
    return await this.budgetService.updateBudgetAccounting(
      request.user.id,
      request.body as BudgetAccountingSchema,
    );
  }

  @Delete('accounting/delete/:id')
  @ApiOperation({ operationId: 'deleteBudgetAccounting' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, type: BadRequest })
  @ApiParam({ name: 'id', required: true, type: 'number' })
  async deleteBudgetAccounting(@Req() request: ExtendedRequest) {
    if (request.params.id === undefined) {
      throw new BadRequestException(WRONG_PARAMS);
    }

    return await this.budgetService.deleteBudgetAccounting(
      request.user.id,
      Number(request.params.id),
    );
  }
}
