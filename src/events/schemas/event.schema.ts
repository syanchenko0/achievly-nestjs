import { z } from 'zod';
import { ZOD_ERROR } from '@/app/constants/error.constant';

const CreateEventSchema = z.object({
  title: z.string(ZOD_ERROR),
  start_timestamp: z.number(ZOD_ERROR),
  end_timestamp: z.number(ZOD_ERROR),
});

const UpdateEventSchema = z.object({
  title: z.string(ZOD_ERROR).optional(),
  start_timestamp: z.number(ZOD_ERROR).optional(),
  end_timestamp: z.number(ZOD_ERROR).optional(),
});

export { CreateEventSchema, UpdateEventSchema };
