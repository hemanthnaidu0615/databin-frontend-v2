import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dates: [
    new Date("2025-05-26").toISOString(),
    new Date("2025-05-27").toISOString(),
  ],
};

const dateRangeSlice = createSlice({
  name: "dateRange",
  initialState,
  reducers: {
    setDates: (state, action) => {
      state.dates = action.payload.map((date: string) => new Date(date).toISOString());
    },
  },
});

export const { setDates } = dateRangeSlice.actions;

export default dateRangeSlice.reducer;
