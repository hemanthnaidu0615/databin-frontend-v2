import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EnterpriseKeyState {
  key: string;
}

const initialState: EnterpriseKeyState = {
  key: "",
};

const enterpriseKeySlice = createSlice({
  name: "enterpriseKey",
  initialState,
  reducers: {
    setEnterpriseKey: (state, action: PayloadAction<string>) => {
      state.key = action.payload;
    },
  },
});

export const { setEnterpriseKey } = enterpriseKeySlice.actions;

export default enterpriseKeySlice.reducer;
