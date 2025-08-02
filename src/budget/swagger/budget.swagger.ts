import { ApiProperty } from '@nestjs/swagger';

class BudgetAccountingSchema {
  @ApiProperty({ type: 'number', required: true })
  id: number;
  @ApiProperty({ type: 'string', required: true })
  name: string;
  @ApiProperty({ type: 'number', required: true })
  value: number;
  @ApiProperty({ type: 'string', required: true })
  date: string;
  @ApiProperty({ type: 'boolean', required: true })
  planned: boolean;
  @ApiProperty({ type: 'string', required: true })
  variant: string;
}

class BudgetAccountingMetaSchema {
  @ApiProperty({
    type: 'object',
    selfRequired: true,
    required: ['income', 'expense', 'planned_income', 'planned_expense'],
    properties: {
      income: { type: 'number' },
      expense: { type: 'number' },
      planned_income: { type: 'number' },
      planned_expense: { type: 'number' },
    },
  })
  total: {
    income: number;
    expense: number;
    planned_income: number;
    planned_expense: number;
  };
  @ApiProperty({ type: 'number', required: true })
  min_year: number;
  @ApiProperty({ type: 'number', required: true })
  max_year: number;
}

class BudgetAccountingDataSchema {
  @ApiProperty({ type: () => BudgetAccountingSchema, isArray: true })
  income: BudgetAccountingSchema[];
  @ApiProperty({ type: () => BudgetAccountingSchema, isArray: true })
  expense: BudgetAccountingSchema[];
}

class BudgetAccountingResponseSchema {
  @ApiProperty({ type: () => BudgetAccountingDataSchema })
  data: BudgetAccountingDataSchema;
  @ApiProperty({ type: BudgetAccountingMetaSchema })
  meta: BudgetAccountingMetaSchema;
}

class BudgetAccountingCreateBodySchema {
  @ApiProperty({ type: 'string', required: true })
  name: string;
  @ApiProperty({ type: 'number', required: true })
  value: number;
  @ApiProperty({ type: 'string', required: true })
  date: string;
  @ApiProperty({ type: 'boolean', required: true })
  planned: boolean;
  @ApiProperty({ type: 'string', required: true })
  variant: string;
}

export {
  BudgetAccountingSchema,
  BudgetAccountingMetaSchema,
  BudgetAccountingResponseSchema,
  BudgetAccountingCreateBodySchema,
};
