import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
};

export const sellerReducer = createReducer(initialState, {
  LoadSellerRequest: (state) => {
    state.loading = true;
  },
  LoadSellerSuccess: (state, action) => {
    state.isAuthenticated = true;
    state.loading = false;
    state.Seller = action.payload;
  },
  LoadSellerFail: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.isAuthenticated = false;
  },
  clearErrors: (state) => {
    state.error = null;
  },
});
