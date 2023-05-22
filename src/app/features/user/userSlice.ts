import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  username: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setGlobalUser: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

export const { setGlobalUser } = userSlice.actions;

export default userSlice.reducer;
