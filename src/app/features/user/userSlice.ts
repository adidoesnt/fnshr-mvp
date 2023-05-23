import { RootState } from "@/app/store";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  points: 0,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setGlobalUser: (
      state,
      action: PayloadAction<{ username: string; points: number }>
    ) => {
      const { username, points } = action.payload
      state.username = username;
      state.points = points
    },
  },
});

export const { setGlobalUser } = userSlice.actions;

export const selectGlobalUser = (state: RootState) => state.user;

export default userSlice.reducer;
