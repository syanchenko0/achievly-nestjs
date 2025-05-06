import { z } from 'zod';
import { ZOD_ERROR } from '@/app/constants/error.constant';

const userEntitySchema = z
  .object({
    username: z.string(ZOD_ERROR),
    email: z.string(ZOD_ERROR),
    picture_url: z.string(ZOD_ERROR).optional(),
  })
  .required();

export { userEntitySchema };
