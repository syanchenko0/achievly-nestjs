import { z } from 'zod';
import { ZOD_ERROR } from '@/app/constants/error.constant';

const createNotificationSchema = z.object({
  title: z.string(ZOD_ERROR),
  description: z.string(ZOD_ERROR).optional(),
  accept: z.string(ZOD_ERROR).optional(),
  reject: z.string(ZOD_ERROR).optional(),
});

export { createNotificationSchema };
