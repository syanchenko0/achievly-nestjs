import { ApiProperty } from '@nestjs/swagger';

class CreateTeamBody {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Наименование команды',
  })
  name: string;
}

class InviteUserBody {
  @ApiProperty({
    type: String,
    required: true,
    description: 'ID приглашения пользователя',
  })
  user_invite_id: string;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'ID команды',
  })
  team_id: number;
}

export { CreateTeamBody, InviteUserBody };
