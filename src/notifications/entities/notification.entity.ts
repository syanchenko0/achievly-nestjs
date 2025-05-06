import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@/users/entities/user.entity';

@Entity()
class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => UserEntity, (user) => user.notifications)
  user: UserEntity;
}

export { NotificationEntity };
