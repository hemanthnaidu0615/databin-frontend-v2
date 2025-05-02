import { configureStore } from "@reduxjs/toolkit";
import dateRangeReducer from "./dateRangeSlice";
import enterpriseKeyReducer from "./enterpriseKeySlice";

export const store = configureStore({
  reducer: {
    dateRange: dateRangeReducer,
    enterpriseKey: enterpriseKeyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["dateRange/setDates"],
        ignoredPaths: ["dateRange.startDate", "dateRange.endDate"],
      },
    }),
});
