import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Callback, Strategy } from 'passport-yandex';

import { AuthService } from '@/auth/auth.service';
import { ISocialProfile } from '@/auth/types/auth.type';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('YANDEX_CLIENT_ID') as string,
      clientSecret: configService.get('YANDEX_CLIENT_SECRET') as string,
      callbackURL: configService.get('YANDEX_CALLBACK_URL') as string,
    });
  }

  validate: Callback<ISocialProfile> = (
    accessToken,
    refreshToken,
    profile,
    done,
  ) => {
    const { name, emails, photos } = profile;

    const user: ISocialProfile = {
      email: emails?.[0]?.value as string,
      firstName: (name as { givenName: string }).givenName,
      lastName: (name as { familyName: string }).familyName,
      picture: photos?.[0]?.value as string,
    };

    done(null, user);
  };
}
