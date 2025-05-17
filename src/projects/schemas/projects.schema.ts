import { z } from 'zod';
import { ZOD_ERROR } from '@/app/constants/error.constant';

const createProjectSchema = z.object({ name: z.string(ZOD_ERROR).nonempty() });

export { createProjectSchema };
