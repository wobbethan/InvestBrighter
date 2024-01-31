import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

export const sectionReducer = createReducer(initialState, {
  // get all sections for admin
  adminAllSectionsRequest: (state) => {
    state.adminSectionLoading = true;
  },
  adminAllSectionsSuccess: (state, action) => {
    state.adminSectionLoading = false;
    state.adminSections = action.payload;
  },
  adminAllSectionsFailed: (state, action) => {
    state.adminSectionLoading = false;
    state.error = action.payload;
  },

  clearErrors: (state) => {
    state.error = null;
  },
});
