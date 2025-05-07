import { z } from 'zod';
import { ZOD_ERROR } from '@/app/constants/error.constant';

const CreateEventSchema = z.object({
  title: z.string(ZOD_ERROR),
  startTimestamp: z.number(ZOD_ERROR),
  endTimestamp: z.number(ZOD_ERROR),
});

const UpdateEventSchema = z.object({
  title: z.string(ZOD_ERROR).optional(),
  startTimestamp: z.number(ZOD_ERROR).optional(),
  endTimestamp: z.number(ZOD_ERROR).optional(),
});

export { CreateEventSchema, UpdateEventSchema };
