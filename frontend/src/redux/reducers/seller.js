import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoadingShop: true,
};

export const sellerReducer = createReducer(initialState, {
  LoadSellerRequest: (state) => {
    state.isLoadingShopShop = true;
  },
  LoadSellerSuccess: (state, action) => {
    state.isSeller = true;
    state.isLoadingShop = false;
    state.seller = action.payload;
  },
  LoadSellerFail: (state, action) => {
    state.isLoadingShop = false;
    state.error = action.payload;
    state.isSeller = false;
  },

  //members for shop
  getAllMembersShopRequest: (state) => {
    state.isLoadingShop = true;
  },
  getAllMembersShopSuccess: (state, action) => {
    state.isLoadingShop = false;
    state.members = action.payload;
  },

  getAllMembersShopFail: (state, action) => {
    state.isLoadingShop = false;
    state.error = action.payload;
  },

  // get all sellers ---admin
  getAllSellersRequest: (state) => {
    state.isLoadingShop = true;
  },
  getAllSellersSuccess: (state, action) => {
    state.isLoadingShop = false;
    state.sellers = action.payload;
  },
  getAllSellerFailed: (state, action) => {
    state.isLoadingShop = false;
    state.error = action.payload;
  },
  clearErrors: (state) => {
    state.error = null;
  },
});
