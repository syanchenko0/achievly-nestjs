import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@/users/entities/user.entity';

@Entity({ name: 'budget_accounting' })
class BudgetAccountingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  value: number;

  @Column({ nullable: false })
  date: Date;

  @Column({ nullable: false })
  planned: boolean;

  @Column({ nullable: false })
  variant: string;

  @ManyToOne(() => UserEntity, (user) => user.budget_accounting)
  user: UserEntity;
}

export { BudgetAccountingEntity };
