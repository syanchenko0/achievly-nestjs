import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ISocialProfile } from '@/auth/types/auth.type';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID') as string,
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET') as string,
      callbackURL: configService.get('GOOGLE_CALLBACK_URL') as string,
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: {
      name: { givenName: string; familyName: string };
      emails: { value: string }[];
      photos: { value: string }[];
    },
    done: VerifyCallback,
  ) {
    console.log({ profile });

    const { name, emails, photos } = profile;

    const user: ISocialProfile = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
    };

    done(null, user);
  }
}
