import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { UsersService } from '@/users/users.service';

import { ISocialProfile } from './types/auth.type';
import { UserEntity } from '@/users/entities/user.entity';
import {
  TOKEN_EXPIRATION_ACCESS,
  TOKEN_EXPIRATION_REFRESH,
} from '@/app/constants/token.contant';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(profile: ISocialProfile) {
    const loginDto = {
      username: [profile.firstName, profile?.lastName ?? ''].join(' ').trim(),
      email: profile.email,
      picture_url: profile?.picture,
    };

    return await this.usersService.create(loginDto);
  }

  async generateTokens({ id, username }: Pick<UserEntity, 'id' | 'username'>) {
    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        { id, username },
        {
          expiresIn: TOKEN_EXPIRATION_ACCESS,
          privateKey: this.configService.get<string>('JWT_SECRET_KEY'),
        },
      ),
      await this.jwtService.signAsync(
        { id, username },
        {
          expiresIn: TOKEN_EXPIRATION_REFRESH,
          privateKey: this.configService.get<string>('JWT_SECRET_KEY'),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async attachTokensToResponse(
    user: Pick<UserEntity, 'id' | 'username'>,
    res: Response,
  ) {
    const { accessToken, refreshToken } = await this.generateTokens(user);

    const accessDay = parseInt(TOKEN_EXPIRATION_ACCESS) * 24 * 60 * 60 * 1000;
    const refreshDay = parseInt(TOKEN_EXPIRATION_REFRESH) * 24 * 60 * 60 * 1000;

    const accessExpiresIn = new Date(Date.now() + accessDay);
    const refreshExpiresIn = new Date(Date.now() + refreshDay);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      expires: accessExpiresIn,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: refreshExpiresIn,
    });
  }
}
