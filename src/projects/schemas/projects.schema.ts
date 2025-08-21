import { z } from 'zod';
import { ZOD_ERROR } from '@/app/constants/error.constant';

const projectColumnSchema = z.object({
  id: z.string(ZOD_ERROR),
  name: z.string(ZOD_ERROR),
  order: z.number(ZOD_ERROR),
  is_removable: z.boolean(ZOD_ERROR).nullish(),
  is_final_stage: z.boolean(ZOD_ERROR).nullish(),
});

const createProjectColumnSchema = z.object({
  name: z.string(ZOD_ERROR),
  is_removable: z.boolean(ZOD_ERROR).nullish(),
  is_final_stage: z.boolean(ZOD_ERROR).nullish(),
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
  deadline_date: z.string(ZOD_ERROR).nullish(),
  parent_task_id: z.number(ZOD_ERROR).nullish(),
});

const createProjectParentTaskSchema = z.object({
  name: z.string(ZOD_ERROR),
  description: z.string(ZOD_ERROR).nullish(),
  deadline_date: z.string(ZOD_ERROR).nullish(),
});

const updateProjectTaskSchema = z.object({
  name: z.string(ZOD_ERROR).nullish(),
  description: z.string(ZOD_ERROR).nullish(),
  column: projectColumnSchema.nullish(),
  priority: z.string(ZOD_ERROR).nullish(),
  executor_member_id: z.number(ZOD_ERROR).nullish(),
  deadline_date: z.string(ZOD_ERROR).nullish(),
  done_date: z.string(ZOD_ERROR).nullish(),
  parent_task_id: z.number(ZOD_ERROR).nullish(),
});

const updateProjectParentTaskSchema = z.object({
  name: z.string(ZOD_ERROR),
  description: z.string(ZOD_ERROR).nullish(),
  deadline_date: z.string(ZOD_ERROR).nullish(),
  done_date: z.string(ZOD_ERROR).nullish(),
  project_task_ids: z.array(z.number(ZOD_ERROR), ZOD_ERROR).nullish(),
});

const updateProjectTaskListOrderBodySchema = z.array(
  z.object({
    id: z.number(ZOD_ERROR),
    list_order: z.number(ZOD_ERROR),
  }),
);

type CreateProjectParentTask = z.infer<typeof createProjectParentTaskSchema>;

type UpdateProjectParentTask = z.infer<typeof updateProjectParentTaskSchema>;

export type { CreateProjectParentTask, UpdateProjectParentTask };

export {
  projectColumnSchema,
  createProjectColumnSchema,
  createProjectSchema,
  createProjectTaskSchema,
  createProjectParentTaskSchema,
  updateProjectSchema,
  updateProjectTaskSchema,
  updateProjectParentTaskSchema,
  updateProjectTaskListOrderBodySchema,
};
