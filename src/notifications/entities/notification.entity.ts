import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@/users/entities/user.entity';

@Entity()
class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  accept?: string;

  @Column({ nullable: true })
  reject?: string;

  @ManyToOne(() => UserEntity, (user) => user.notifications)
  user: UserEntity;
}

export { NotificationEntity };
