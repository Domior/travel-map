import { configureStore } from '@reduxjs/toolkit';
import googleSlice from './slices/googleSlice';

export const store = configureStore({
  reducer: {
    google: googleSlice,
  },
});
