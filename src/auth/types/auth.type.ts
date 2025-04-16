interface ISocialProfile {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
}

interface ICookies {
  refreshToken?: string;
  accessToken?: string;
}

type TokenParsed = {
  id: number;
  username: string;
};

export type { ISocialProfile, ICookies, TokenParsed };
