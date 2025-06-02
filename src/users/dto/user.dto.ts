import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '@/users/entities/user.entity';

class ProfileDto {
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

  constructor(user: UserEntity) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.picture_url = user.picture_url;
  }
}

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

  constructor(user: UserEntity) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.picture_url = user.picture_url;
  }
}

export { UserDto, ProfileDto };
