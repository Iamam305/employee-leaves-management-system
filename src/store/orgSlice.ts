import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selected: false,
  selectedOrg: null,
};

const organisationSlice = createSlice({
  name: "Org",
  initialState:initialState,
  reducers: {
    selectOrg: (state, action) => {
      state.selected = true;
      state.selectedOrg = action.payload;
    },
    unSelectOrg: (state) => {
      state.selected = false;
      state.selectedOrg = null;
    },
  },
});

export const { selectOrg, unSelectOrg } = organisationSlice.actions;

export default organisationSlice.reducer;
