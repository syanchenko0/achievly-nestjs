import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-vkontakte';
import { ISocialProfile } from '@/auth/types/auth.type';

@Injectable()
export class VkontakteStrategy extends PassportStrategy(Strategy, 'vkontakte') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('VKONTAKTE_CLIENT_ID') as string,
      clientSecret: configService.get('VKONTAKTE_CLIENT_SECRET') as string,
      callbackURL: configService.get('VKONTAKTE_CALLBACK_URL') as string,
    });
  }

  validate = (
    accessToken: string,
    refreshToken: string,
    profile: {
      name: { givenName: string; familyName: string };
      emails: { value: string }[];
      photos: { value: string }[];
    },
    done: VerifyCallback,
  ) => {
    const { name, emails, photos } = profile;

    const user: ISocialProfile = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
    };

    done(null, user);
  };
}
