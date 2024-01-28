import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  members: [],
};

export const sellerReducer = createReducer(initialState, {
  LoadSellerRequest: (state) => {
    state.isLoading = true;
  },
  LoadSellerSuccess: (state, action) => {
    state.isSeller = true;
    state.isLoading = false;
    state.seller = action.payload;
  },
  LoadSellerFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
    state.isSeller = false;
  },

  //members for shop
  getAllMembersShopRequest: (state) => {
    state.isLoading = true;
  },
  getAllMembersShopSuccess: (state, action) => {
    state.isLoading = false;
    state.members = action.payload;
  },

  getAllMembersShopFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // get all sellers ---admin
  getAllSellersRequest: (state) => {
    state.isLoading = true;
  },
  getAllSellersSuccess: (state, action) => {
    state.isLoading = false;
    state.sellers = action.payload;
  },
  getAllSellerFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  clearErrors: (state) => {
    state.error = null;
  },
});
