import { configureStore } from "@reduxjs/toolkit";
import dateRangeReducer from "./dateRangeSlice";

export const store = configureStore({
  reducer: {
    dateRange: dateRangeReducer,
    // add more reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["dateRange/setDates"],
        ignoredPaths: ["dateRange.startDate", "dateRange.endDate"],
      },
    }),
});