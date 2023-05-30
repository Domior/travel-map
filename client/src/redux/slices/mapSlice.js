import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

import { MAP_INITIAL_POSITION } from '../../constants/google_map';

const initialState = {
  position: MAP_INITIAL_POSITION,
  address: '',
  searchValue: '',
  markers: [],
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setPosition(state, { payload }) {
      state.position = payload;
    },
    setAddress(state, { payload }) {
      state.address = payload;
    },
    setSearchValue(state, { payload }) {
      state.searchValue = payload;
    },
    setMarkers(state, { payload }) {
      state.markers = [...state.markers, { id: uuid(), position: { ...payload } }];
    },
    handleMarkerDblClick(state, { payload }) {
      state.markers = [...state.markers.filter(marker => marker.id !== payload)];
    },
    clear(state) {
      state.address = '';
      state.searchValue = '';
    },
  },
});

export const {
  setPosition,
  setAddress,
  setSearchValue,
  setMarkers,
  handleMarkerDblClick,
  clear,
} = mapSlice.actions;

export default mapSlice.reducer;
