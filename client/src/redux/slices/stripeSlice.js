import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  paymentMethod: null,
};

export const stripeSlice = createSlice({
  name: 'stripe',
  initialState,
  reducers: {
    setPaymentMethod(state, { payload }) {
      state.paymentMethod = payload;
    },
  },
});

export const { setPaymentMethod } = stripeSlice.actions;

export default stripeSlice.reducer;
