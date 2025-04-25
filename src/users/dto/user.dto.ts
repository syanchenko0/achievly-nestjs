import { ApiProperty } from '@nestjs/swagger';
import { EventEntity } from '@/events/entities/event.entity';
import { GoalEntity } from '@/goals/entities/goal.entity';
import { NotificationEntity } from '@/notifications/entities/notification.entity';
import { ProjectEntity } from '@/projects/entities/project.entity';
import { TeamEntity } from '@/teams/entities/team.entity';
import { UserEntity } from '@/users/entities/user.entity';

class UserDto {
  @ApiProperty({
    description: 'ID пользователя',
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Имя пользователя',
    type: String,
    example: 'Username',
  })
  username: string;

  @ApiProperty({
    description: 'Email пользователя',
    type: String,
    example: 'mail@mail.com',
  })
  email: string;

  @ApiProperty({
    description: 'Изображение пользователя',
    type: String,
    example: 'https://picture.com',
  })
  picture_url: string;

  @ApiProperty({
    description: 'События в календаре',
    type: EventEntity,
    isArray: true,
    required: false,
    nullable: true,
  })
  events?: EventEntity[];

  @ApiProperty({
    description: 'Цели пользователя',
    type: GoalEntity,
    isArray: true,
    required: false,
    nullable: true,
  })
  goals?: GoalEntity[];

  @ApiProperty({
    description: 'Уведомления пользователя',
    type: NotificationEntity,
    isArray: true,
    required: false,
    nullable: true,
  })
  notifications?: NotificationEntity[];

  @ApiProperty({
    description: 'Проекты пользователя',
    type: ProjectEntity,
    isArray: true,
    required: false,
    nullable: true,
  })
  projects?: ProjectEntity[];

  @ApiProperty({
    description: 'Команды пользователя',
    type: TeamEntity,
    isArray: true,
    required: false,
    nullable: true,
  })
  teams?: TeamEntity[];

  constructor(user: UserEntity) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.picture_url = user.picture_url;
    this.events = user.events;
    this.goals = user.goals;
    this.notifications = user.notifications;
    this.projects = user.projects;
    this.teams = user.teams;
  }
}

export { UserDto };
