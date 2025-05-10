import { z } from 'zod';
import { ZOD_ERROR } from '@/app/constants/error.constant';

const createTeamSchema = z.object({
  name: z.string(ZOD_ERROR),
});

type CreateTeamBody = z.infer<typeof createTeamSchema>;

export { createTeamSchema };

export type { CreateTeamBody };
