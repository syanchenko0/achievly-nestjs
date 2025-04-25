import {
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GoalEntity } from '@/goals/entities/goal.entity';

class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true, type: 'string' })
  deadlineDate?: string;

  @Column({ nullable: true, type: 'string' })
  note?: string;

  @Column({ nullable: true, type: 'string' })
  doneDate?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => GoalEntity, (goal) => goal.tasks)
  goal: GoalEntity;
}

export { TaskEntity };
