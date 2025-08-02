import { z } from 'zod';
import { ZOD_ERROR } from '@/app/constants/error.constant';

const BudgetAccountingItemSchema = z.object({
  id: z.number(ZOD_ERROR),
  name: z.string(ZOD_ERROR),
  value: z.number(ZOD_ERROR),
  date: z.string(ZOD_ERROR),
  planned: z.boolean(ZOD_ERROR),
  variant: z.string(ZOD_ERROR),
});

const CreateBudgetAccountingSchema = z.object({
  name: z.string(ZOD_ERROR),
  value: z.number(ZOD_ERROR),
  date: z.string(ZOD_ERROR),
  planned: z.boolean(ZOD_ERROR),
  variant: z.string(ZOD_ERROR),
});

type BudgetAccountingItem = z.infer<typeof BudgetAccountingItemSchema>;

type CreateBudgetAccounting = z.infer<typeof CreateBudgetAccountingSchema>;

export type { BudgetAccountingItem, CreateBudgetAccounting };

export { BudgetAccountingItemSchema, CreateBudgetAccountingSchema };
