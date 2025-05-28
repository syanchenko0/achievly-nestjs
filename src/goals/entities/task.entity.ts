import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GoalEntity } from '@/goals/entities/goal.entity';

@Entity({ name: 'goal_task' })
class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  deadline_date?: string;

  @Column({ nullable: true })
  note?: string;

  @Column({ nullable: true })
  done_date?: string;

  @Column({ nullable: true })
  list_order?: number;

  @Column({ nullable: true })
  goal_list_order?: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => GoalEntity, (goal) => goal.tasks)
  goal: GoalEntity;
}

export { TaskEntity };
