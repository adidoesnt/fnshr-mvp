import { RootState } from "@/app/store";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  points: 0,
  friends: [] as string[],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setGlobalUser: (
      state,
      action: PayloadAction<{ username: string; points: number, friends: string[] }>
    ) => {
      const { username, points, friends } = action.payload
      state.username = username;
      state.points = points;
      state.friends = friends;
    },
    setFriends: (state, action) => {
      state.friends = action.payload;
    }
  },
});

export const { setGlobalUser, setFriends } = userSlice.actions;

export const selectGlobalUser = (state: RootState) => state.user;

export default userSlice.reducer;
