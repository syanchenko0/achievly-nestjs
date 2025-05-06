import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GoalEntity } from '@/goals/entities/goal.entity';

@Entity()
class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true, type: 'timestamptz' })
  deadlineDate?: Date;

  @Column({ nullable: true })
  note?: string;

  @Column({ nullable: true, type: 'timestamptz' })
  doneDate?: Date;

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
