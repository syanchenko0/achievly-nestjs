import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@/users/entities/user.entity';

@Entity()
class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: false, type: 'bigint' })
  start_timestamp: number;

  @Column({ nullable: false, type: 'bigint' })
  end_timestamp: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.events)
  user: UserEntity;
}

export { EventEntity };
