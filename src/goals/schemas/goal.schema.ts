import { GoalStatusEnum } from '@/goals/constants/goal.constant';
import { z } from 'zod';
import { ZOD_ERROR } from '@/app/constants/error.constant';

const GetGoalsSchema = z.object({
  status: z.enum([GoalStatusEnum.Ongoing, GoalStatusEnum.Achieved]).optional(),
});

const CreateTaskSchema = z.object({
  title: z.string(ZOD_ERROR),
  deadline_date: z.string(ZOD_ERROR).nullish().nullable().optional(),
  note: z.string(ZOD_ERROR).nullish().nullable().optional(),
});

const UpdateTaskSchema = z.object({
  id: z.number(ZOD_ERROR),
  title: z.string(ZOD_ERROR).optional(),
  deadline_date: z.string(ZOD_ERROR).optional().nullable().nullish(),
  note: z.string(ZOD_ERROR).optional().nullable().nullish(),
  done_date: z.string(ZOD_ERROR).optional().nullable().nullish(),
});

const UpdateTaskListOrderBodySchema = z.array(
  z.object({
    id: z.number(ZOD_ERROR),
    list_order: z.number(ZOD_ERROR),
  }),
);

const UpdateGoalListOrderBodySchema = z.array(
  z.object({
    id: z.number(ZOD_ERROR),
    list_order: z.number(ZOD_ERROR),
  }),
);

const CreateGoalSchema = z.object({
  title: z.string(ZOD_ERROR),
  category: z.enum([
    'education',
    'career',
    'finance',
    'health',
    'sports',
    'relationships',
    'travel',
    'creativity',
    'business',
    'personalGrowth',
    'charity',
    'hobby',
    'spirituality',
    'ecology',
    'socialActivity',
  ]),
  deadline_date: z.string(ZOD_ERROR).nullish().nullable().optional(),
  note: z.string(ZOD_ERROR).nullish().nullable().optional(),
  tasks: z.array(CreateTaskSchema).nullish().nullable().optional(),
});

const UpdateGoalSchema = z.object({
  title: z.string(ZOD_ERROR).optional(),
  category: z
    .enum([
      'education',
      'career',
      'finance',
      'health',
      'sports',
      'relationships',
      'travel',
      'creativity',
      'business',
      'personalGrowth',
      'charity',
      'hobby',
      'spirituality',
      'ecology',
      'socialActivity',
    ])
    .optional(),
  status: z.enum(['ongoing', 'achieved']).optional(),
  deadline_date: z.string(ZOD_ERROR).optional().nullable().nullish(),
  note: z.string(ZOD_ERROR).optional().nullable().nullish(),
  achieved_date: z.string(ZOD_ERROR).optional().nullable().nullish(),
  tasks: z
    .array(
      z.object({
        id: z.number(ZOD_ERROR).optional(),
        title: z.string(ZOD_ERROR).optional(),
        deadline_date: z.string(ZOD_ERROR).optional().nullable().nullish(),
        note: z.string(ZOD_ERROR).optional().nullable().nullish(),
        done_date: z.string(ZOD_ERROR).optional().nullable().nullish(),
      }),
    )
    .optional()
    .nullable()
    .nullish(),
});

export {
  GetGoalsSchema,
  CreateGoalSchema,
  UpdateGoalSchema,
  UpdateTaskSchema,
  UpdateTaskListOrderBodySchema,
  UpdateGoalListOrderBodySchema,
};
