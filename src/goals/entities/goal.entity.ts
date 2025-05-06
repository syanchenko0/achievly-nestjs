import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@/users/entities/user.entity';
import {
  GoalCategoryEnum,
  GoalStatusEnum,
} from '@/goals/constants/goal.constant';
import { TaskEntity } from '@/goals/entities/task.entity';

@Entity()
class GoalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'enum', enum: GoalCategoryEnum, nullable: false })
  category: GoalCategoryEnum;

  @Column({
    type: 'enum',
    enum: GoalStatusEnum,
    default: GoalStatusEnum.Ongoing,
    nullable: false,
  })
  status: GoalStatusEnum;

  @Column({ nullable: true, type: 'timestamptz' })
  deadlineDate?: Date;

  @Column({ nullable: true })
  note?: string;

  @Column({ nullable: true, type: 'timestamptz' })
  achievedDate?: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.goals)
  user: UserEntity;

  @OneToMany(() => TaskEntity, (task) => task.goal)
  tasks: TaskEntity[];
}

export { GoalEntity };
