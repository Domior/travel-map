import { googleInstance } from './index';

export class GoogleService {
  static async getProfileInfo(access_token) {
    return googleInstance.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
    );
  }
}
