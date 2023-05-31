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
    resetStripe(state) {
      state.paymentMethod = null;
    },
  },
});

export const { setPaymentMethod, resetStripe } = stripeSlice.actions;

export default stripeSlice.reducer;
