import { Request } from 'express';
import { UserEntity } from '@/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

type RequestUser = Pick<UserEntity, 'id' | 'username'>;

type ExtendedRequest = Request & { user: RequestUser };

class BadRequest {
  @ApiProperty({ type: String, description: 'Error message' })
  message: string;

  @ApiProperty({ type: String, description: 'Error type' })
  error: string;

  @ApiProperty({ type: Number, description: 'Error status code' })
  statusCode: number;
}

export type { ExtendedRequest, RequestUser };

export { BadRequest };
