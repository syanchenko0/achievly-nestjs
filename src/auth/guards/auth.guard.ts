import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

import { ICookies, TokenParsed } from '@/auth/types/auth.type';
import {
  TOKEN_EXPIRATION_ACCESS,
  TOKEN_EXPIRATION_REFRESH,
} from '@/app/constants/token.contant';
import { WRONG_TOKEN } from '@/app/constants/error.constant';
import { UsersService } from '@/users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const cookies: ICookies = request.cookies;

    const { accessToken, refreshToken } = cookies;

    if (accessToken) {
      try {
        const tokenParsed = await this.jwtService.verifyAsync<TokenParsed>(
          accessToken,
          {
            secret: this.configService.get('JWT_SECRET_KEY'),
          },
        );

        const user = await this.usersService.getUserById(tokenParsed.id);

        if (!user) {
          throw new UnauthorizedException(WRONG_TOKEN);
        }

        if (!refreshToken) {
          const refreshToken = await this.jwtService.signAsync(tokenParsed, {
            expiresIn: TOKEN_EXPIRATION_REFRESH,
            privateKey: this.configService.get<string>('JWT_SECRET_KEY'),
          });

          const refreshDay =
            parseInt(TOKEN_EXPIRATION_REFRESH) * 24 * 60 * 60 * 1000;

          const refreshExpiresIn = new Date(Date.now() + refreshDay);

          response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            expires: refreshExpiresIn,
          });
        }

        request['user'] = tokenParsed;
      } catch {
        throw new UnauthorizedException(WRONG_TOKEN);
      }
    }

    if (!accessToken && refreshToken) {
      try {
        const tokenParsed = await this.jwtService.verifyAsync<TokenParsed>(
          refreshToken,
          {
            secret: this.configService.get('JWT_SECRET_KEY'),
          },
        );

        const user = await this.usersService.getUserById(tokenParsed.id);

        if (!user) {
          throw new UnauthorizedException(WRONG_TOKEN);
        }

        const accessToken = await this.jwtService.signAsync(tokenParsed, {
          expiresIn: TOKEN_EXPIRATION_ACCESS,
          privateKey: this.configService.get<string>('JWT_SECRET_KEY'),
        });

        const accessDay =
          parseInt(TOKEN_EXPIRATION_ACCESS) * 24 * 60 * 60 * 1000;

        const accessExpiresIn = new Date(Date.now() + accessDay);

        response.cookie('accessToken', accessToken, {
          httpOnly: true,
          expires: accessExpiresIn,
        });

        request['user'] = tokenParsed;
      } catch {
        throw new UnauthorizedException(WRONG_TOKEN);
      }
    }

    if (!accessToken && !refreshToken) {
      throw new UnauthorizedException(WRONG_TOKEN);
    }

    return true;
  }
}
