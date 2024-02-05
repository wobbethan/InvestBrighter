import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

export const eventReducer = createReducer(initialState, {
  eventCreateRequest: (state) => {
    state.isLoading = true;
  },
  eventCreateSuccess: (state, action) => {
    state.isLoading = false;
    state.event = action.payload;
    state.success = true;
  },
  eventCreateFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
    state.success = false;
  },

  //all events shop
  getAllEventsShopRequest: (state) => {
    state.isLoading = true;
  },
  getAllEventsShopSuccess: (state, action) => {
    state.isLoading = false;
    state.events = action.payload;
  },
  getAllEventsShopFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // delete event of a shop
  deleteEventRequest: (state) => {
    state.isLoading = true;
  },
  deleteEventSuccess: (state, action) => {
    state.isLoading = false;
    state.message = action.payload;
  },
  deleteEventFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // get all events
  getAllEventsRequest: (state) => {
    state.isLoading = true;
  },
  getAllEventsSuccess: (state, action) => {
    state.isLoading = false;
    state.allEvents = action.payload;
  },
  getAllEventsFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // get all section
  getAllEventsSectionRequest: (state) => {
    state.isLoading = true;
  },
  getAllEventsSectionSuccess: (state, action) => {
    state.isLoading = false;
    state.allEventsSection = action.payload;
  },
  getAllEventsSectionFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  clearErrors: (state) => {
    state.error = null;
  },
});
