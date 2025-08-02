import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GoalEntity } from '@/goals/entities/goal.entity';
import { EventEntity } from '@/events/entities/event.entity';
import { NotificationEntity } from '@/notifications/entities/notification.entity';
import { ProjectEntity } from '@/projects/entities/projects.entity';
import { TeamEntity } from '@/teams/entities/team.entity';
import { BudgetAccountingEntity } from '@/budget/entities/budget.entity';

@Entity()
class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  picture_url: string;

  @OneToMany(() => EventEntity, (event) => event.user)
  events: EventEntity[];

  @OneToMany(() => GoalEntity, (goal) => goal.user)
  goals: GoalEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];

  @OneToMany(() => ProjectEntity, (project) => project.user)
  projects: ProjectEntity[];

  @ManyToMany(() => TeamEntity, (team) => team.users)
  teams: TeamEntity[];

  @OneToMany(
    () => BudgetAccountingEntity,
    (budget_accounting) => budget_accounting.user,
  )
  budget_accounting: BudgetAccountingEntity[];
}

export { UserEntity };
