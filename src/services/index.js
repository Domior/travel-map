import axios from 'axios';

import { SessionStorageService } from '../services/SessionStorage';
import { ACCESS_TOKEN_KEY } from '../constants/storage';

export const googleInstance = axios.create({
  headers: {
    Authorization: `Bearer ${
      SessionStorageService.getItem(ACCESS_TOKEN_KEY)?.accessToken
    }`,
    Accept: 'application/json',
  },
});
