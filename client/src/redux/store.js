import { configureStore } from '@reduxjs/toolkit';
import googleSlice from './slices/googleSlice';
import stripeSlice from './slices/stripeSlice';
import mapSlice from './slices/mapSlice';

export const store = configureStore({
  reducer: {
    google: googleSlice,
    stripe: stripeSlice,
    map: mapSlice,
  },
});
