import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '@/users/entities/user.entity';

@Entity()
class TeamEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column(() => UserEntity)
  created_by: UserEntity;

  @ManyToMany(() => UserEntity, (user) => user.teams)
  @JoinTable()
  users: UserEntity[];
}

export { TeamEntity };
