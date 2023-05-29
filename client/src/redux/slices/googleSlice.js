import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { GoogleService } from '../../services/GoogleService';
import { STATUSES } from '../../constants/login';

export const fetchProfile = createAsyncThunk('google/fetchProfile', async token => {
  const { data } = await GoogleService.getProfileInfo(token);
  return data;
});

const initialState = {
  profile: null,
  status: null,
};

export const googleSlice = createSlice({
  name: 'google',
  initialState,
  reducers: {
    setProfile(state, { payload }) {
      state.profile = payload;
    },
    setStatus(state, { payload }) {
      state.status = payload;
    },
  },
  extraReducers: {
    [fetchProfile.pending]: state => {
      state.profile = null;
      state.status = STATUSES.LOADING;
    },
    [fetchProfile.fulfilled]: (state, { payload }) => {
      state.profile = payload;
      state.status = STATUSES.SUCCESS;
    },
    [fetchProfile.rejected]: state => {
      state.profile = null;
      state.status = STATUSES.ERROR;
    },
  },
});

export const { setProfile, setStatus } = googleSlice.actions;

export default googleSlice.reducer;
