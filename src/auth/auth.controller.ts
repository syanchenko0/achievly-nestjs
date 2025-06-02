import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeEndpoint, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from '@/auth/auth.service';
import { ISocialProfile } from '@/auth/types/auth.type';
import { JwtAuthGuard } from '@/auth/guards/auth.guard';
import { ExtendedRequest } from '@/app/types/common.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('/check')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401 })
  @ApiOperation({ summary: 'Проверка авторизации', operationId: 'checkAuth' })
  async checkAuth() {}

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400 })
  @ApiOperation({ summary: 'logout', operationId: 'logout' })
  logout(
    @Req() request: ExtendedRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.cookie('accessToken', '', {
      expires: new Date(0),
      httpOnly: true,
    });

    response.cookie('refreshToken', '', {
      expires: new Date(0),
      httpOnly: true,
    });

    return;
  }

  @ApiExcludeEndpoint()
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @ApiExcludeEndpoint()
  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: { user: ISocialProfile },
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.login(req.user);

    await this.authService.attachTokensToResponse(user, response);

    response.redirect(this.configService.get('CLIENT_URL') as string);
  }

  @ApiExcludeEndpoint()
  @Get('/yandex')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuth() {}

  @ApiExcludeEndpoint()
  @Get('/yandex/redirect')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuthRedirect(
    @Req() req: { user: ISocialProfile },
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.login(req.user);

    await this.authService.attachTokensToResponse(user, response);

    response.redirect(this.configService.get('CLIENT_URL') as string);
  }

  @ApiExcludeEndpoint()
  @Get('/vkontakte')
  @UseGuards(AuthGuard('vkontakte'))
  async vkontakteAuth() {}

  @ApiExcludeEndpoint()
  @Get('/vkontakte/redirect')
  @UseGuards(AuthGuard('vkontakte'))
  async vkontakteAuthRedirect(
    @Req() req: { user: ISocialProfile },
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.login(req.user);

    await this.authService.attachTokensToResponse(user, response);

    response.redirect(this.configService.get('CLIENT_URL') as string);
  }
}
