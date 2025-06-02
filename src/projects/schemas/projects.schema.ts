import { z } from 'zod';
import { ZOD_ERROR } from '@/app/constants/error.constant';

const projectColumnSchema = z.object({
  id: z.string(ZOD_ERROR),
  name: z.string(ZOD_ERROR),
  order: z.number(ZOD_ERROR),
});

const createProjectSchema = z.object({ name: z.string(ZOD_ERROR).nonempty() });

const updateProjectSchema = z.object({
  name: z.string(ZOD_ERROR).nullish(),
  columns: z.array(projectColumnSchema).nullish(),
});

const createProjectTaskSchema = z.object({
  name: z.string(ZOD_ERROR),
  description: z.string(ZOD_ERROR).nullish(),
  column: projectColumnSchema,
  priority: z.string(ZOD_ERROR).nullish(),
  executor_member_id: z.number(ZOD_ERROR).nullish(),
});

const updateProjectTaskSchema = z.object({
  name: z.string(ZOD_ERROR).nullish(),
  description: z.string(ZOD_ERROR).nullish(),
  column: projectColumnSchema.nullish(),
  priority: z.string(ZOD_ERROR).nullish(),
  executor_member_id: z.number(ZOD_ERROR).nullish(),
});

export {
  createProjectSchema,
  createProjectTaskSchema,
  updateProjectSchema,
  updateProjectTaskSchema,
};
