import { GoalStatusEnum } from '@/goals/constants/goal.constant';
import { z } from 'zod';
import { ZOD_ERROR } from '@/app/constants/error.constant';

const GetGoalsSchema = z.object({
  status: z.enum([GoalStatusEnum.Ongoing, GoalStatusEnum.Achieved]).optional(),
});

const CreateTaskSchema = z.object({
  title: z.string(ZOD_ERROR),
  deadline_date: z.string(ZOD_ERROR).optional(),
  note: z.string(ZOD_ERROR).optional(),
});

const UpdateTasksSchema = z.array(
  z.object({
    id: z.number(ZOD_ERROR),
    title: z.string(ZOD_ERROR).optional(),
    deadline_date: z.string(ZOD_ERROR).optional().nullable().nullish(),
    note: z.string(ZOD_ERROR).optional().nullable().nullish(),
    done_date: z.string(ZOD_ERROR).optional().nullable().nullish(),
  }),
);

const UpdateTaskSchema = z.object({
  id: z.number(ZOD_ERROR).optional(),
  title: z.string(ZOD_ERROR),
  deadline_date: z.string(ZOD_ERROR).optional(),
  note: z.string(ZOD_ERROR).optional(),
  done_date: z.string(ZOD_ERROR).optional(),
});

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
  deadline_date: z.string(ZOD_ERROR).optional(),
  note: z.string(ZOD_ERROR).optional(),
  tasks: z.array(CreateTaskSchema).optional(),
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
  deadline_date: z.string(ZOD_ERROR).optional(),
  note: z.string(ZOD_ERROR).optional(),
  achieved_date: z.string(ZOD_ERROR).optional(),
  tasks: z.array(UpdateTaskSchema).optional(),
});

export {
  GetGoalsSchema,
  CreateGoalSchema,
  UpdateGoalSchema,
  UpdateTasksSchema,
};
