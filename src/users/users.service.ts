import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/users/entities/user.entity';
import { Repository } from 'typeorm';
import { WRONG_BODY } from '@/app/constants/error.constant';
import { userEntitySchema } from '@/users/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    const candidate = await this.userRepository.findOneBy({
      email: user.email,
    });

    if (candidate) {
      return candidate;
    }

    const validateResult = userEntitySchema.safeParse(user);

    if (validateResult.error) throw new BadRequestException(WRONG_BODY);

    return await this.userRepository.save(user);
  }

  async getUserById(id: number): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async getUserByInviteId(invite_id: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ invite_id });
  }
}
