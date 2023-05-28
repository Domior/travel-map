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

export const stripeInstance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    Accept: 'application/json',
  },
});
