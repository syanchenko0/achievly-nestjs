import { z } from 'zod';
import { ZOD_ERROR } from '@/app/constants/error.constant';

const createTeamSchema = z.object({
  name: z.string(ZOD_ERROR).nonempty(),
});

const updateTeamMemberSchema = z.object({
  role: z.enum(['owner', 'admin', 'member']).optional(),
  projects_rights: z
    .array(
      z.object({
        project_id: z.number(ZOD_ERROR),
        create: z.boolean(ZOD_ERROR),
        read: z.boolean(ZOD_ERROR),
        update: z.boolean(ZOD_ERROR),
        delete: z.boolean(ZOD_ERROR),
      }),
    )
    .optional(),
});

export { createTeamSchema, updateTeamMemberSchema };
