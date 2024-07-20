import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selected: false,
  memberShipData: null,
};
export const membershipSlice = createSlice({
  name: "membership",
  initialState: initialState,
  reducers: {
    selectMembership: (state, action) => {
      state.selected = true;
      state.memberShipData = action.payload;
    },
    unSelectMembership: (state) => {
      state.selected = false;
      state.memberShipData = null;
    },
  },
});
export const { selectMembership, unSelectMembership } = membershipSlice.actions;
export default membershipSlice.reducer;
