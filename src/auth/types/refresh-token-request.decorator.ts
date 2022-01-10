import { RefreshTokenPayload } from '.';

export type RefreshTokenRequest = RefreshTokenPayload & {
  refresh_token: string;
};
