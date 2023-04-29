import { googleInstance } from './index';

export const getGoogleProfileInfo = access_token =>
  googleInstance.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
  );
