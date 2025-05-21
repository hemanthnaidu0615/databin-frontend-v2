import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dates: ["2025-03-19T00:00:00.000Z", "2025-03-20T00:00:00.000Z"],
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
